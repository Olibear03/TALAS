import { useParams } from 'react-router-dom'
import { Lock, Sparkles, Bandage, Clock, Check, ShieldCheck, type LucideIcon } from 'lucide-react'
import {
  learnerProfile,
  crlaDescription,
  type RecentActivityItem,
} from '../dashboard/sectionData'
import ReadingAttempts from './ReadingAttempts'
import { useCrlaGrade, crlaBadgeClasses } from './useCrlaGrade'
import {
  LEVEL_LABEL,
  mixedReadingForLevel,
  readingLevelFromAccuracy,
} from '../../../data/contentBank'

function fmtDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
}

interface PracticeView {
  level: string
  domain: string
  note: string
}

/**
 * Derives the "Current Practice" view from the learner's real CRLA grade.
 * Maps the CRLA level to the matching adaptive practice band from the Content
 * Bank (1 Beginner … 5 Higher) and writes a short note from the actual data.
 */
function derivePractice(grade: ReturnType<typeof useCrlaGrade>): PracticeView | null {
  if (!grade.assessed || grade.level == null || grade.bestAccuracy == null) return null

  const practiceLevel = readingLevelFromAccuracy(grade.bestAccuracy)
  const band = LEVEL_LABEL[practiceLevel]
  const next = mixedReadingForLevel(practiceLevel)

  return {
    level: `Antas ${practiceLevel} · ${band}`,
    domain: 'Awtomatiko',
    note: next
      ? `Awtomatikong pinili mula sa CRLA (${grade.label}, ${grade.bestAccuracy}%): "${next.title}" ang susunod na babasahin.`
      : `Awtomatikong pinili mula sa CRLA (${grade.label}, ${grade.bestAccuracy}%): Antas ${practiceLevel}.`,
  }
}

type ReadingPace = 'fast' | 'steady' | 'slow' | 'struggling' | 'unknown'

interface ReadingComment {
  pace: ReadingPace
  /** Short headline, e.g. "Mabilis magbasa". */
  headline: string
  /** Teacher-facing explanation of how the learner reads. */
  detail: string
  /** Suggested next step for intervention. */
  suggestion: string
  /** Words-per-minute, when measurable. */
  wpm: number | null
}

/**
 * Derives a reading-pace comment from the learner's best reading attempt:
 * whether they read fast, at a steady pace, slowly, or are struggling / can't
 * yet read. Speed is correct words per minute (needs durationSec); if accuracy
 * is very low the learner is "struggling" regardless of speed.
 *
 * WPM bands are rough early-grade guides (Filipino oral reading):
 *   ≥ 90 wpm  → fast
 *   60–89 wpm → steady
 *   < 60 wpm  → slow
 * Accuracy below the CRLA Full-Refresher cutoff (75%) overrides to struggling.
 */
function deriveReadingComment(grade: ReturnType<typeof useCrlaGrade>): ReadingComment | null {
  const a = grade.bestAttempt
  if (!a) return null

  const accuracy = a.accuracy
  const minutes = a.durationSec && a.durationSec > 0 ? a.durationSec / 60 : null
  const wpm = minutes ? Math.round(a.correctWords / minutes) : null

  // Very low accuracy → the learner can barely decode the passage yet.
  if (accuracy < 50) {
    return {
      pace: 'struggling',
      headline: 'Nahihirapang bumasa',
      detail: `Mababa ang katumpakan (${accuracy}%). Kaunti pa lamang sa mga salita ang nababasa nang tama${
        wpm != null ? `, sa bilis na ${wpm} salita kada minuto` : ''
      }.`,
      suggestion:
        'Simulan sa phonics at pagkilala ng salita (Antas 1). Gabayang pagbasa nang sama-sama bawat araw.',
      wpm,
    }
  }

  // Accuracy is okay but we have no timing — comment on accuracy only.
  if (wpm == null) {
    const struggling = accuracy < 75
    return {
      pace: struggling ? 'struggling' : 'unknown',
      headline: struggling ? 'Nahihirapang bumasa' : 'Walang sukat ng bilis',
      detail: struggling
        ? `Nasa ${accuracy}% ang katumpakan — kailangan pa ng suporta sa pagkilala ng salita.`
        : `Nasa ${accuracy}% ang katumpakan. Walang recording na may tagal kaya hindi masukat ang bilis ng pagbasa.`,
      suggestion: struggling
        ? 'Mag-focus sa decoding at madalas na gabayang pagbasa.'
        : 'Magtala ng pagbasa na may recording upang masukat ang bilis (words per minute).',
      wpm: null,
    }
  }

  // We have both accuracy and speed.
  if (wpm >= 90) {
    return {
      pace: 'fast',
      headline: 'Mabilis magbasa',
      detail: `Bumabasa nang ${wpm} salita kada minuto na may ${accuracy}% katumpakan.`,
      suggestion:
        accuracy < 90
          ? 'Mabilis ngunit may mali — hikayatin ang maingat na pagbasa para tumaas ang katumpakan.'
          : 'Mahusay ang bilis at katumpakan — bigyan ng mas mahahabang teksto at pang-unawang tanong.',
      wpm,
    }
  }
  if (wpm >= 60) {
    return {
      pace: 'steady',
      headline: 'Katamtaman ang bilis',
      detail: `Bumabasa nang ${wpm} salita kada minuto na may ${accuracy}% katumpakan.`,
      suggestion:
        'Ituloy ang pang-araw-araw na pagbasa nang malakas upang mapabilis at mapanatili ang katumpakan.',
      wpm,
    }
  }
  return {
    pace: 'slow',
    headline: 'Mabagal magbasa',
    detail: `Bumabasa nang ${wpm} salita kada minuto na may ${accuracy}% katumpakan.`,
    suggestion:
      'Magsanay ng paulit-ulit na pagbasa (repeated reading) ng maikling teksto upang mapataas ang bilis.',
    wpm,
  }
}

/** Chip classes per reading pace. */
const PACE_META: Record<ReadingPace, { label: string; cls: string }> = {
  fast: { label: 'Mabilis', cls: 'bg-sprout-50 text-sprout-500' },
  steady: { label: 'Katamtaman', cls: 'bg-sky-50 text-sky-500' },
  slow: { label: 'Mabagal', cls: 'bg-buttercup-50 text-buttercup-500' },
  struggling: { label: 'Nahihirapan', cls: 'bg-coral-50 text-coral-500' },
  unknown: { label: 'Walang sukat', cls: 'bg-gray-100 text-gray-400' },
}

const ACTIVITY_META: Record<
  RecentActivityItem['type'],
  { icon: LucideIcon; chip: string }
> = {
  'Formal Assessment': { icon: Lock, chip: 'bg-sprout-50 text-sprout-500' },
  Practice: { icon: Sparkles, chip: 'bg-sky-50 text-sky-500' },
  Intervention: { icon: Bandage, chip: 'bg-buttercup-50 text-buttercup-500' },
}

/** Overview tab — current reading situation across formal, practice, and intervention. */
function Overview() {
  const { learnerId } = useParams()
  const profile = learnerProfile(learnerId)
  // Hooks must run unconditionally and in the same order every render, so call
  // this before any early return.
  const grade = useCrlaGrade(learnerId)

  if (!profile) return null
  const { intervention } = profile

  // Current Practice is derived from the learner's real CRLA grade + reading
  // submissions (the adaptive signal we actually have), not static mock detail.
  const practice = derivePractice(grade)

  // Recent Activity shows only the single most recent submitted reading.
  const recentActivity: RecentActivityItem[] = grade.attempts.slice(0, 1).map((a) => ({
    date: fmtDate(a.createdAt),
    type: 'Practice',
    label: `Oral reading · ${a.accuracy}%`,
    detail: `${a.correctWords}/${a.totalWords} tama · ${a.online ? 'online' : 'offline'}`,
  }))

  // Intervention note: an auto-generated comment on HOW the learner reads
  // (fast / steady / slow / struggling), derived from their best attempt.
  const readingComment = deriveReadingComment(grade)

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------ */}
      {/* 1. FORMAL ASSESSMENT SNAPSHOT — CRLA grade from best reading  */}
      {/* ------------------------------------------------------------ */}
      <section className="bg-white rounded-2xl border-2 border-sprout-500/30 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-3 bg-sprout-50 border-b border-sprout-500/20">
          <Lock className="w-5 h-5 text-charcoal" aria-hidden />
          <h2 className="font-display text-base font-bold text-charcoal">
            Formal Assessment Snapshot
          </h2>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-sprout-500 font-sans text-xs font-bold">
            <Check className="w-3.5 h-3.5" aria-hidden /> CRLA · from best reading
          </span>
        </div>

        {grade.assessed && grade.bestAttempt ? (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CRLA level */}
              <div className="bg-paper border border-gray-100 rounded-xl p-4 space-y-1">
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  CRLA reading level
                </span>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-display text-xl font-bold text-charcoal">
                    {grade.level}
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full font-sans text-xs font-bold ${crlaBadgeClasses(grade.level)}`}
                  >
                    {grade.label}
                  </span>
                </div>
                <p className="font-sans text-xs text-gray-500 leading-relaxed">
                  {crlaDescription(grade.level)}
                </p>
              </div>

              {/* Grading evidence (best attempt) */}
              <div className="bg-paper border border-gray-100 rounded-xl p-4 space-y-1">
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  Grading basis
                </span>
                <p className="font-display text-xl font-bold text-charcoal">
                  {grade.bestAccuracy}%
                </p>
                <p className="font-sans text-xs text-gray-500">
                  Best oral reading · {grade.bestAttempt.correctWords}/{grade.bestAttempt.totalWords} tama
                </p>
                <p className="font-sans text-xs text-gray-400">
                  Across {grade.attempts.length} submission{grade.attempts.length === 1 ? '' : 's'}
                </p>
              </div>

              {/* Latest assessment date */}
              <div className="bg-paper border border-gray-100 rounded-xl p-4 space-y-1">
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  Latest assessment
                </span>
                <p className="font-sans text-sm font-bold text-charcoal">
                  {fmtDate(grade.bestAttempt.createdAt)}
                </p>
                <p className="font-sans text-xs text-gray-500">
                  {grade.bestAttempt.online ? 'Online' : 'Offline'} · oral reading
                </p>
              </div>
            </div>

            <p className="font-sans text-xs text-gray-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden /> CRLA grade derived from
              the learner's best oral-reading accuracy. Practice sessions do not overwrite this
              baseline.
            </p>
          </div>
        ) : (
          <p className="p-6 font-sans text-sm text-gray-400">
            No formal assessment on record yet. A CRLA level appears here once the learner completes
            a reading.
          </p>
        )}
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 2. ORAL READING SUBMISSIONS — live, synced from the learner   */}
      {/* ------------------------------------------------------------ */}
      <ReadingAttempts learnerId={learnerId} />

      {/* ------------------------------------------------------------ */}
      {/* 2. CURRENT PRACTICE — adaptive, clearly separate from formal  */}
      {/* ------------------------------------------------------------ */}
      <section className="bg-white rounded-2xl border border-dashed border-sky-500/40 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-3 bg-sky-50 border-b border-sky-500/20">
          <Sparkles className="w-5 h-5 text-charcoal" aria-hidden />
          <h2 className="font-display text-base font-bold text-charcoal">Current Practice</h2>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-sky-500 font-sans text-xs font-bold">
            Adaptive · not a formal record
          </span>
        </div>

        {practice ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-sky-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  Current practice difficulty
                </span>
                <p className="font-sans text-sm font-bold text-charcoal">{practice.level}</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-white text-sky-500 font-sans text-xs font-bold shrink-0">
                {practice.domain}
              </span>
            </div>


            <p className="font-sans text-xs text-gray-500 bg-sky-50/60 rounded-lg px-3 py-2">
              {practice.note}
            </p>
          </div>
        ) : (
          <p className="p-6 font-sans text-sm text-gray-400">
            Tatapusin muna ng mag-aaral ang paunang pagbasa upang awtomatikong matukoy ang susunod na antas.
          </p>
        )}
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 3 + 4. Intervention and Recent Activity (two columns)         */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intervention */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bandage className="w-5 h-5 text-charcoal" aria-hidden />
            <h2 className="font-display text-base font-bold text-charcoal">Intervention</h2>
          </div>

          {/* Auto reading-pace comment: how the learner reads (fast/slow/can't). */}
          {readingComment ? (
            <div className="p-4 rounded-xl bg-paper border border-gray-100 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans text-sm font-bold text-charcoal">
                  {readingComment.headline}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-sans text-xs font-bold ${PACE_META[readingComment.pace].cls}`}
                >
                  {readingComment.wpm != null
                    ? `${readingComment.wpm} salita/min`
                    : PACE_META[readingComment.pace].label}
                </span>
              </div>
              <p className="font-sans text-sm text-gray-600">{readingComment.detail}</p>
              <p className="font-sans text-xs text-gray-500 bg-sky-50/60 rounded-lg px-3 py-2">
                <span className="font-semibold text-charcoal">Mungkahi:</span>{' '}
                {readingComment.suggestion}
              </p>
            </div>
          ) : (
            <p className="font-sans text-sm text-gray-400">
              Walang pagbasa pa para masuri kung paano bumabasa ang mag-aaral.
            </p>
          )}

          {intervention ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-bold text-charcoal">
                  {intervention.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-buttercup-50 text-buttercup-500 font-sans text-xs font-bold">
                  {intervention.tier}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-paper border border-gray-100">
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  Target skill / need
                </span>
                <p className="font-sans text-sm text-gray-600">{intervention.description}</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-sans text-xs">
                  <span className="text-gray-400">
                    {intervention.directive} · progress
                  </span>
                  <span className="font-bold text-sprout-500">
                    {intervention.modulesCompleted}/{intervention.modulesTotal} modules
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: intervention.modulesTotal }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 rounded-full ${
                        i < intervention.modulesCompleted ? 'bg-sprout-500' : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="font-sans text-xs text-gray-400">Next: {intervention.nextSession}</p>
            </div>
          ) : null}
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-charcoal" aria-hidden />
            <h2 className="font-display text-base font-bold text-charcoal">Recent Activity</h2>
          </div>

          {recentActivity.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {recentActivity.map((a, i) => {
                const meta = ACTIVITY_META[a.type]
                const MetaIcon = meta.icon
                return (
                  <li
                    key={`${a.date}-${i}`}
                    className="flex items-start gap-3 p-3 rounded-xl bg-paper border border-gray-100"
                  >
                    <span
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 text-charcoal"
                      aria-hidden="true"
                    >
                      <MetaIcon className="w-4 h-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-full font-sans text-xs font-bold ${meta.chip}`}>
                          {a.type}
                        </span>
                        <span className="font-sans text-xs text-gray-400 shrink-0">{a.date}</span>
                      </div>
                      <p className="font-sans text-sm font-semibold text-charcoal mt-1">{a.label}</p>
                      <p className="font-sans text-xs text-gray-500">{a.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="font-sans text-sm text-gray-400">No recent activity recorded yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default Overview
