/**
 * TALAS — oral reading scorer.
 *
 * Compares what a learner *said* (a transcript, from the Web Speech API online
 * or a manual/offline transcript) against the *expected* passage, word by word,
 * and returns an accuracy score plus a per-word correct/incorrect breakdown.
 *
 * This runs entirely on-device with no network, so scoring works identically
 * offline and online — the only part that may need a connection is the speech
 * recognizer that produces the transcript (handled in `useSpeechRecognition`).
 *
 * Matching strategy: we normalize both sides (lowercase, strip punctuation and
 * Filipino-relevant diacritics), expand hyphenated words into parts, then run a
 * greedy in-order alignment (the same one used for live highlighting) so the
 * final result matches what the learner saw while reading. A skipped word
 * doesn't cascade every later word into "wrong".
 */

import type { WordResult } from "../data/types";

/**
 * Normalizes a single token for comparison:
 *   "Masayang," -> "masayang",  "Niño" -> "nino"
 * Keeps letters/numbers only, folds diacritics, lowercases.
 */
export function normalizeWord(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
    .toLowerCase()
    .replace(/[^a-z0-9ñ]/g, ""); // keep ñ (common in Filipino), drop punctuation
}

/** Splits a passage/transcript into display tokens (whitespace-separated). */
export function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Expands a display token into one or more normalized sub-words.
 *
 * Hyphenated Filipino words ("gustong-gusto", "araw-araw", "pag-asa") are a
 * SINGLE passage token, but a speech recognizer returns them as separate words
 * ("gusto gusto"). If we normalized the whole thing to "gustonggusto" it would
 * never match. So we split on hyphens/en-dashes and normalize each part, and a
 * display word only counts as correct when ALL of its parts are matched.
 */
export function expandToken(displayToken: string): string[] {
  return displayToken
    .split(/[-\u2010-\u2015\u2212]/) // hyphen + unicode dashes
    .map(normalizeWord)
    .filter(Boolean);
}

/** Levenshtein edit distance between two short strings. */
function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/**
 * Fuzzy word equality. Exact match, or a near-match that tolerates small
 * recognizer errors: 1 edit for medium words, 2 for long words. Short words
 * (<= 3 letters, e.g. "ang", "sa") must match exactly to avoid false hits.
 */
export function wordsMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const len = Math.min(a.length, b.length);
  if (len <= 3) return false;
  const allowed = len >= 7 ? 2 : 1;
  return editDistance(a, b) <= allowed;
}

/**
 * Greedy in-order alignment of `spoken` onto `expected`, returning a mask of
 * which expected words were matched. This mirrors the live `readingProgress`
 * logic so the final score agrees with what the learner saw while reading:
 *
 *  - matches each spoken word at/after the current cursor,
 *  - tolerates small skips via a lookahead window, and if the window misses,
 *    scans further ahead so a longer skip re-syncs instead of failing the rest,
 *  - uses fuzzy word equality (recognizer near-misses still count),
 *  - never un-marks a word already matched.
 */
function alignSequential(
  expected: string[],
  spoken: string[],
  window = 2,
): { mask: boolean[]; spokenIndex: number[] } {
  const mask = new Array<boolean>(expected.length).fill(false);
  // For each expected word, the index of the spoken word that matched it
  // (-1 if none). Lets callers attach the spoken word's exact timing.
  const spokenIndex = new Array<number>(expected.length).fill(-1);
  let cursor = 0;
  let si = 0;
  for (const word of spoken) {
    const thisSpoken = si++;
    if (cursor >= expected.length) break;
    let matchedAt = -1;
    // Near window first (tolerates a 1–2 word skip), then a far scan to
    // re-sync after a longer jump.
    for (let k = 0; k <= window && cursor + k < expected.length; k++) {
      if (wordsMatch(expected[cursor + k], word)) {
        matchedAt = cursor + k;
        break;
      }
    }
    if (matchedAt < 0) {
      for (let j = cursor + window + 1; j < expected.length; j++) {
        if (wordsMatch(expected[j], word)) {
          matchedAt = j;
          break;
        }
      }
    }
    if (matchedAt >= 0) {
      // Only the actually-spoken word is correct. Words the reader skipped over
      // (between cursor and matchedAt) stay false — they were not read.
      mask[matchedAt] = true;
      spokenIndex[matchedAt] = thisSpoken;
      cursor = matchedAt + 1;
    }
    // No match anywhere ahead: extra/noise word, keep cursor.
  }
  return { mask, spokenIndex };
}

export interface ReadingScore {
  accuracy: number; // 0–100
  correctWords: number;
  totalWords: number;
  words: WordResult[];
}

/**
 * Scores a reading attempt. `passage` is the original story text; `transcript`
 * is whatever the recognizer/learner produced.
 */
export function scoreReading(passage: string, transcript: string): ReadingScore {
  const expectedDisplay = tokenize(passage);

  // Flatten passage into sub-words (so hyphenated words become multiple units),
  // remembering which display word each sub-word belongs to.
  const expectedNorm: string[] = [];
  const ownerOfSub: number[] = [];
  expectedDisplay.forEach((token, index) => {
    const parts = expandToken(token);
    // A token with no letters (e.g. a stray "—") still occupies one slot.
    if (parts.length === 0) {
      expectedNorm.push(normalizeWord(token));
      ownerOfSub.push(index);
      return;
    }
    for (const part of parts) {
      expectedNorm.push(part);
      ownerOfSub.push(index);
    }
  });

  const spokenNorm = tokenize(transcript).map(normalizeWord).filter(Boolean);

  // Greedy, in-order alignment — the SAME strategy as the live highlighting
  // (readingProgress), so a word shown correct while reading stays correct in
  // the final result. LCS global optimization could flip some of those, which
  // is what made live and final disagree.
  const { mask: subMask, spokenIndex: subSpokenIndex } = alignSequential(
    expectedNorm,
    spokenNorm,
  );

  // A display word is correct only when ALL of its sub-words matched. Its
  // spoken index is the FIRST matched sub-word's spoken index (used to attach
  // the exact recognizer timing for click-to-seek).
  const allMatched = new Array<boolean>(expectedDisplay.length).fill(true);
  const anySubs = new Array<boolean>(expectedDisplay.length).fill(false);
  const firstSpoken = new Array<number>(expectedDisplay.length).fill(-1);
  subMask.forEach((matched, k) => {
    const owner = ownerOfSub[k];
    anySubs[owner] = true;
    if (!matched) allMatched[owner] = false;
    if (matched && firstSpoken[owner] === -1) {
      firstSpoken[owner] = subSpokenIndex[k];
    }
  });

  const words: WordResult[] = expectedDisplay.map((word, index) => ({
    index,
    expected: word,
    correct: anySubs[index] ? allMatched[index] : false,
    spokenIndex: firstSpoken[index],
  }));

  const totalWords = expectedDisplay.length;
  const correctWords = words.reduce((n, w) => n + (w.correct ? 1 : 0), 0);
  const accuracy =
    totalWords === 0 ? 0 : Math.round((correctWords / totalWords) * 100);

  return { accuracy, correctWords, totalWords, words };
}

export interface ReadingProgress {
  /** Per-passage-word mask: true once the reader has read that word in order. */
  read: boolean[];
  /** Index of the next word the reader is expected to say (the cursor). */
  cursor: number;
}

/**
 * Position-aware live progress for highlighting while the learner reads.
 *
 * Unlike a global "have we heard this word anywhere" check, this walks the
 * spoken words through the passage *in order* and only advances a cursor. So:
 *   - saying a word that appears later in the passage does NOT light it up
 *     early (we only match at/near the current cursor),
 *   - repeated words (e.g. "ang" ... "ang") are matched to their own position
 *     one at a time, instead of all lighting at once,
 *   - a single skipped/misheard word doesn't stall progress — a small lookahead
 *     window lets the cursor skip ahead by at most `window` words to re-sync.
 *
 * This drives the live UI; `scoreReading` uses the same alignment strategy so
 * the final result agrees with what was highlighted during reading.
 */
export function readingProgress(
  passage: string,
  transcript: string,
  window = 2,
): ReadingProgress {
  const displayTokens = tokenize(passage);

  // Expand to sub-words (hyphenated words -> multiple units), tracking owners.
  const expected: string[] = [];
  const ownerOfSub: number[] = [];
  displayTokens.forEach((token, index) => {
    const parts = expandToken(token);
    const units = parts.length > 0 ? parts : [normalizeWord(token)];
    for (const part of units) {
      expected.push(part);
      ownerOfSub.push(index);
    }
  });

  const spoken = tokenize(transcript).map(normalizeWord).filter(Boolean);
  const subRead = new Array<boolean>(expected.length).fill(false);

  let cursor = 0; // cursor over sub-words
  for (const word of spoken) {
    if (cursor >= expected.length) break;
    // Look for this spoken word at the cursor or up to `window` sub-words ahead,
    // so one skipped/misrecognized word can be stepped over to re-align.
    let matchedAt = -1;
    for (let k = 0; k <= window && cursor + k < expected.length; k++) {
      if (wordsMatch(expected[cursor + k], word)) {
        matchedAt = cursor + k;
        break;
      }
    }
    if (matchedAt >= 0) {
      // Mark everything from the cursor through the matched sub-word as read.
      for (let i = cursor; i <= matchedAt; i++) subRead[i] = true;
      cursor = matchedAt + 1;
    }
    // If no match within the window, treat it as noise/extra speech and keep
    // the cursor where it is (don't advance on words that aren't in the text).
  }

  // Collapse sub-word progress back to display words: a word is "read" only
  // when every sub-word is read; the display cursor is the first unread word.
  const read = new Array<boolean>(displayTokens.length).fill(true);
  const seen = new Array<boolean>(displayTokens.length).fill(false);
  subRead.forEach((wasRead, k) => {
    const owner = ownerOfSub[k];
    seen[owner] = true;
    if (!wasRead) read[owner] = false;
  });
  for (let i = 0; i < read.length; i++) {
    if (!seen[i]) read[i] = false;
  }
  let displayCursor = read.findIndex((r) => !r);
  if (displayCursor === -1) displayCursor = displayTokens.length;

  return { read, cursor: displayCursor };
}

/** Maps an accuracy score to a learner-friendly band + label. */
export function accuracyBand(accuracy: number): {
  tone: "strong" | "ok" | "weak";
  label: string;
} {
  if (accuracy >= 80) return { tone: "strong", label: "Mahusay!" };
  if (accuracy >= 60) return { tone: "ok", label: "Magaling, ituloy mo lang!" };
  return { tone: "weak", label: "Subukan nating muli." };
}
