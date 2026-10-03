// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityType = 'comprehension' | 'vocabulary' | 'read-aloud' | 'word-practice'
export type ActivityStatus = 'available' | 'completed' | 'locked'

export interface WordHelp {
  word: string
  simpleDefinition: string
  example: string
}

export interface ComprehensionQuestion {
  question: string
  choices: [string, string, string, string]
  correctIndex: number
}

export interface VocabItem {
  word: string
  meaning: string
  choices: [string, string, string, string]
  correctIndex: number
}

export interface WordPracticeItem {
  sentence: string          // contains ___ placeholder
  choices: [string, string, string, string]
  correctIndex: number
  hint: string
}

export interface PracticeActivityDef {
  id: string
  title: string
  type: ActivityType
  level: number
}

export interface PracticeProfile {
  currentLevel: number
  recentScores: number[]
  consecutiveHighScores: number
  consecutiveLowScores: number
  completedActivityIds: string[]
}

// ─── Internal activity registry (never exposed as a browsable catalog) ─────────

export const activityRegistry: PracticeActivityDef[] = [
  { id: 'practice-001', title: 'Ang Munting Ibon',        type: 'comprehension', level: 1 },
  { id: 'practice-002', title: 'Hanapin ang Salita',      type: 'vocabulary',    level: 1 },
  { id: 'practice-003', title: 'Basahin Natin',           type: 'read-aloud',    level: 1 },
  { id: 'practice-004', title: 'Piliin ang Tamang Salita', type: 'word-practice', level: 2 },
  { id: 'practice-005', title: 'Ang Munting Palaka',      type: 'comprehension', level: 2 },
  { id: 'practice-006', title: 'Salitang Bago',           type: 'vocabulary',    level: 2 },
  { id: 'practice-007', title: 'Basahin ang Kuwento',     type: 'comprehension', level: 3 },
]

// ─── Adaptive activity selection ──────────────────────────────────────────────

/**
 * Returns the next appropriate practice activity for the learner.
 * Matches the learner's current practice level and avoids immediately repeating
 * the last completed activity. TALAS determines this — the learner never sees
 * the full registry.
 */
export function getNextPracticeActivity(profile: PracticeProfile): PracticeActivityDef {
  const lastCompletedId = profile.completedActivityIds[profile.completedActivityIds.length - 1]

  // Candidates at the learner's current level, excluding the most recently completed activity
  let candidates = activityRegistry.filter(
    (a) => a.level === profile.currentLevel && a.id !== lastCompletedId,
  )

  // If all same-level activities were excluded (e.g. only one at this level), drop the exclusion
  if (candidates.length === 0) {
    candidates = activityRegistry.filter((a) => a.level === profile.currentLevel)
  }

  // Deterministic pick: first match (stable, replaceable by backend recommendation later)
  if (candidates.length > 0) {
    return candidates[0]
  }

  // Ultimate fallback: first level-1 activity
  return activityRegistry.find((a) => a.level === 1)!
}

// ─── Practice level adaptation ────────────────────────────────────────────────

/**
 * Returns an updated PracticeProfile after a completed activity.
 * Applies TALAS practice adaptation rules:
 *   - score >= 80 for 3 consecutive attempts → level up (max 3)
 *   - score 60–79 → stay at current level
 *   - score < 60 for 2 consecutive attempts → level down (min 1)
 * Does NOT touch the learner's Formal Assessment result.
 */
export function updatePracticeLevel(
  profile: PracticeProfile,
  scorePercent: number,
  completedActivityId: string,
): PracticeProfile {
  const updated: PracticeProfile = {
    ...profile,
    recentScores: [...profile.recentScores, scorePercent].slice(-10),
    completedActivityIds: [...profile.completedActivityIds, completedActivityId].slice(-20),
    consecutiveHighScores: profile.consecutiveHighScores,
    consecutiveLowScores: profile.consecutiveLowScores,
    currentLevel: profile.currentLevel,
  }

  if (scorePercent >= 80) {
    updated.consecutiveHighScores += 1
    updated.consecutiveLowScores = 0
    if (updated.consecutiveHighScores >= 3) {
      updated.currentLevel = Math.min(3, updated.currentLevel + 1)
      updated.consecutiveHighScores = 0
    }
  } else if (scorePercent >= 60) {
    updated.consecutiveHighScores = 0
    updated.consecutiveLowScores = 0
  } else {
    updated.consecutiveLowScores += 1
    updated.consecutiveHighScores = 0
    if (updated.consecutiveLowScores >= 2) {
      updated.currentLevel = Math.max(1, updated.currentLevel - 1)
      updated.consecutiveLowScores = 0
    }
  }

  return updated
}

// ─── Comprehension content (practice-001) ────────────────────────────────────

export const comprehensionPassage = {
  title: 'Ang Munting Ibon',
  paragraphs: [
    'Sa isang malaking puno sa gitna ng kagubatan, may isang munting ibon na nakatira. Ang kanyang pangalan ay Pip. Mayroon siyang maliliit na pakpak at maliwanag na kulay dilaw na balahibo.',
    'Isang umaga, nahulog ang pugad ni Pip sa malakas na hangin. Naiyak siya nang husto. Ngunit nakarating ang tulong — dumating ang isang matandang pagong na nagngangalang Mang Bao.',
    '"Huwag kang mag-alala," sabi ni Mang Bao. "Sama-sama nating itatayo muli ang iyong tahanan." Nagtulungan sila at naayos nila ang pugad. Nang gabing iyon, maayos na nakatulog si Pip.',
  ],
  wordHelp: [
    { word: 'pugad', simpleDefinition: 'tirahan ng ibon na gawa sa dayami at sanga', example: 'Gumawa ang ibon ng pugad sa puno.' },
    { word: 'balahibo', simpleDefinition: 'ang mga malambot na telang tumutubo sa katawan ng ibon', example: 'Malambot ang balahibo ng sisiw.' },
    { word: 'kagubatan', simpleDefinition: 'lugar na may maraming puno', example: 'Maraming hayop ang nakatira sa kagubatan.' },
  ] as WordHelp[],
  questions: [
    {
      question: 'Saan nakatira si Pip?',
      choices: ['Sa ilog', 'Sa malaking puno sa kagubatan', 'Sa kabukiran', 'Sa simboryo ng simbahan'] as [string, string, string, string],
      correctIndex: 1,
    },
    {
      question: 'Bakit naiyak si Pip?',
      choices: ['Nagutom siya', 'Nawala ang kanyang kaibigan', 'Nahulog ang kanyang pugad', 'Nasugatan ang kanyang pakpak'] as [string, string, string, string],
      correctIndex: 2,
    },
    {
      question: 'Sino ang tumulong kay Pip?',
      choices: ['Isang daga', 'Isang matandang pagong', 'Isang bata', 'Isang malalim na isda'] as [string, string, string, string],
      correctIndex: 1,
    },
  ] as ComprehensionQuestion[],
}

// ─── Vocabulary content (practice-002) ───────────────────────────────────────

export const vocabularyItems: VocabItem[] = [
  {
    word: 'masagana',
    meaning: 'maraming pagkain o ani; mayaman',
    choices: ['gutom', 'maraming pagkain o ani', 'malungkot', 'mabagal'] as [string, string, string, string],
    correctIndex: 1,
  },
  {
    word: 'maliksi',
    meaning: 'mabilis at magaan ang galaw',
    choices: ['matamlay', 'mabagal', 'mabilis at magaan ang galaw', 'malungkot'] as [string, string, string, string],
    correctIndex: 2,
  },
  {
    word: 'mapagmahal',
    meaning: 'nagmamahal sa iba; mabuti ang puso',
    choices: ['nagmamahal sa iba; mabuti ang puso', 'galit', 'matapang', 'tahimik'] as [string, string, string, string],
    correctIndex: 0,
  },
  {
    word: 'tiyaga',
    meaning: 'hindi sumusuko; nagpapatuloy kahit mahirap',
    choices: ['tamad', 'mabilis mawalan ng pag-asa', 'hindi sumusuko; nagpapatuloy kahit mahirap', 'masaya'] as [string, string, string, string],
    correctIndex: 2,
  },
]

// ─── Read Aloud content (practice-003) ───────────────────────────────────────

export const readAloudPassage = {
  title: 'Basahin Natin: Ang Maliit na Palaka',
  sentences: [
    'May isang maliit na palaka na nakatira sa tabi ng lawa.',
    'Araw-araw, tumalon siya mula sa isang bato papunta sa isa pa.',
    'Isang araw, nakita niya ang isang magandang bulaklak sa gitna ng lawa.',
    '"Gusto ko ng bulaklak na iyon!" sabi niya sa sarili.',
    'Dahan-dahan siyang lumangoy patungo sa bulaklak.',
    'Nang makarating siya, masayang-masaya ang palaka.',
  ],
}

// ─── Word Practice content (practice-004) ────────────────────────────────────

export const wordPracticeItems: WordPracticeItem[] = [
  {
    sentence: 'Si Ana ay _____ sa pagbabasa ng mga aklat.',
    choices: ['tamad', 'masipag', 'malungkot', 'galit'] as [string, string, string, string],
    correctIndex: 1,
    hint: 'Palagi siyang nagbabasa kahit walang pasok.',
  },
  {
    sentence: 'Ang mga bulaklak sa hardin ay napaka-_____.',
    choices: ['pangit', 'maingay', 'maganda', 'mabaho'] as [string, string, string, string],
    correctIndex: 2,
    hint: 'Nasisiyahan kang tumingin sa kanila.',
  },
  {
    sentence: 'Tumutulong si Ben sa kanyang _____ sa palayan.',
    choices: ['kaaway', 'ama', 'guro', 'kapitbahay'] as [string, string, string, string],
    correctIndex: 1,
    hint: 'Ang tatay niya ay nagsasaka.',
  },
  {
    sentence: 'Maagang bumangon si Lito dahil may _____ siya sa paaralan.',
    choices: ['tulog', 'laro', 'klase', 'pahinga'] as [string, string, string, string],
    correctIndex: 2,
    hint: 'Pumupunta siya sa gusaling may mga guro.',
  },
]
