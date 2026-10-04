import { useParams } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  Clock,
  Mic,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
} from 'lucide-react'
import { useAssessmentAttempts } from './useAssessmentAttempts'
import {
  LEVEL_LABEL,
  getActivity,
  mixedReadingForLevel,
  readingLevelFromAccuracy,
} from '../../../data/contentBank'

function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
}

function formatDuration(seconds: number | undefined): string {
  if (seconds == null || seconds <= 0) return 'No timing'
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

type ProgressKind = 'Oral' | 'Silent'

interface ProgressEntry {
  id: string
  kind: ProgressKind
  createdAt: string
  title: string
  score: number
  detail: string
  durationSec?: number
}

function trendFor(entries: ProgressEntry[]): {
  label: string
  cls: string
  Icon: typeof TrendingUp
} {
  if (entries.length < 2) {
    return { label: 'Starting point', cls: 'bg-sky-50 text-sky-500', Icon: Minus }
  }
  const chronological = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const change = chronological.at(-1)!.score - chronological.at(-2)!.score
  if (change > 5) {
    return { label: 'Improving', cls: 'bg-sprout-50 text-sprout-500', Icon: TrendingUp }
  }
  if (change < -5) {
    return { label: 'Needs attention', cls: 'bg-coral-50 text-coral-500', Icon: TrendingDown }
  }
  return { label: 'Steady', cls: 'bg-sky-50 text-sky-500', Icon: Minus }
}

/** Practice Progress — real, learner-scoped oral and silent reading history. */
function Activities() {
  const { learnerId } = useParams()
  const { oralAttempts, silentAttempts, loading, refresh } = useAssessmentAttempts(learnerId)

  const entries: ProgressEntry[] = [
    ...oralAttempts.map((attempt) => ({
      id: attempt.id,
      kind: 'Oral' as const,
      createdAt: attempt.createdAt,
      title: getActivity(attempt.passageId)?.title ?? 'Pasalitang Pagbasa',
      score: attempt.accuracy,
      detail: `${attempt.correctWords}/${attempt.totalWords} salitang tama · ${
        attempt.method === 'manual' ? 'manual transcript' : 'speech recognition'
      }`,
      durationSec: attempt.durationSec,
    })),
    ...silentAttempts.map((attempt) => ({
      id: attempt.id,
      kind: 'Silent' as const,
      createdAt: attempt.createdAt,
      title: attempt.title,
      score: attempt.scorePercent,
      detail: `${attempt.correctAnswers}/${attempt.totalQuestions} sagot na tama · pag-unawa`,
      durationSec: attempt.durationSec,
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const bestOral = oralAttempts.length > 0
    ? Math.max(...oralAttempts.map((attempt) => attempt.accuracy))
    : null
  const oralAverage = average(oralAttempts.map((attempt) => attempt.accuracy))
  const silentAverage = average(silentAttempts.map((attempt) => attempt.scorePercent))
  const automaticLevel = bestOral == null ? null : readingLevelFromAccuracy(bestOral)
  const nextReading = automaticLevel == null ? null : mixedReadingForLevel(automaticLevel)
  const trend = trendFor(entries)
  const TrendIcon = trend.Icon
  const chartEntries = entries.slice(0, 8).reverse()

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-dashed border-sky-500/40 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 px-6 py-3 bg-sky-50 border-b border-sky-500/20">
          <Sparkles className="w-5 h-5 text-charcoal" aria-hidden />
          <h2 className="font-display text-base font-bold text-charcoal">Practice Progress</h2>
          <span className="ml-auto inline-flex px-2.5 py-0.5 rounded-full bg-white text-sky-500 font-sans text-xs font-bold">
            Oral + Silent
          </span>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                Automatic reading level
              </span>
              <p className="font-sans text-sm font-bold text-charcoal">
                {automaticLevel == null
                  ? 'Complete the baseline oral reading first'
                  : `Antas ${automaticLevel} · ${LEVEL_LABEL[automaticLevel]}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans text-xs font-bold ${trend.cls}`}>
                <TrendIcon className="w-4 h-4" aria-hidden /> {trend.label}
              </span>
              <button
                type="button"
                onClick={refresh}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-paper font-sans text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden /> Refresh
              </button>
            </div>
          </div>

          {nextReading && (
            <p className="font-sans text-xs text-gray-500 bg-sky-50/60 rounded-lg px-3 py-2">
              Susunod na awtomatikong babasahin: <strong className="text-charcoal">{nextReading.title}</strong>, batay sa pinakamahusay na oral score na {bestOral}%.
            </p>
          )}
        </div>
      </section>

      {/* Oral and silent summaries stay separate so the scores are not confused. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-coral-500">
            <Mic className="w-5 h-5" aria-hidden />
            <span className="font-sans text-xs font-bold uppercase tracking-wide">Oral Reading</span>
          </div>
          <p className="font-display text-3xl font-bold text-charcoal mt-3">
            {oralAverage == null ? '—' : `${oralAverage}%`}
          </p>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Average accuracy · {oralAttempts.length} attempt{oralAttempts.length === 1 ? '' : 's'}
          </p>
          {bestOral != null && (
            <p className="font-sans text-xs font-semibold text-sprout-500 mt-2">Best: {bestOral}%</p>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-sky-500">
            <BookOpen className="w-5 h-5" aria-hidden />
            <span className="font-sans text-xs font-bold uppercase tracking-wide">Silent Reading</span>
          </div>
          <p className="font-display text-3xl font-bold text-charcoal mt-3">
            {silentAverage == null ? '—' : `${silentAverage}%`}
          </p>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Average comprehension · {silentAttempts.length} attempt{silentAttempts.length === 1 ? '' : 's'}
          </p>
          {silentAttempts[0] && (
            <p className="font-sans text-xs font-semibold text-sky-500 mt-2">
              Latest: {silentAttempts[0].correctAnswers}/{silentAttempts[0].totalQuestions} correct
            </p>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-sprout-500">
            <BarChart3 className="w-5 h-5" aria-hidden />
            <span className="font-sans text-xs font-bold uppercase tracking-wide">All Activity</span>
          </div>
          <p className="font-display text-3xl font-bold text-charcoal mt-3">{entries.length}</p>
          <p className="font-sans text-xs text-gray-500 mt-1">Total oral + silent sessions</p>
          {entries[0] && (
            <p className="font-sans text-xs font-semibold text-sprout-500 mt-2">
              Latest score: {entries[0].score}%
            </p>
          )}
        </section>
      </div>

      {loading && entries.length === 0 ? (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center font-sans text-sm text-gray-400">
          Loading oral and silent progress…
        </section>
      ) : entries.length === 0 ? (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center font-sans text-sm text-gray-400">
          No oral or silent reading records for this learner yet.
        </section>
      ) : (
        <>
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-charcoal" aria-hidden />
              <h2 className="font-display text-base font-bold text-charcoal">Progress Over Time</h2>
              <span className="ml-auto font-sans text-xs text-gray-400">Last {chartEntries.length}</span>
            </div>
            <div className="flex items-end gap-3 h-40">
              {chartEntries.map((entry) => (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                  <div className="w-full flex items-end justify-center h-24 bg-paper border border-gray-100 rounded-lg p-1.5">
                    <div
                      className={`w-full rounded-md transition-all duration-500 ${entry.kind === 'Oral' ? 'bg-coral-400' : 'bg-sky-400'}`}
                      style={{ height: `${Math.max(5, entry.score)}%` }}
                      title={`${entry.kind}: ${entry.score}%`}
                    />
                  </div>
                  <span className="font-sans text-xs font-bold text-charcoal">{entry.score}%</span>
                  <span className={`font-sans text-[10px] font-bold ${entry.kind === 'Oral' ? 'text-coral-500' : 'text-sky-500'}`}>
                    {entry.kind}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4">
              <Clock className="w-5 h-5 text-charcoal" aria-hidden />
              <h2 className="font-display text-base font-bold text-charcoal">Oral & Silent History</h2>
              <span className="ml-auto font-sans text-xs text-gray-400">{entries.length} sessions</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-y border-gray-100 bg-paper">
                    <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                    <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Activity</th>
                    <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
                    <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-6 py-3 font-sans text-sm text-gray-600 whitespace-nowrap">{formatDate(entry.createdAt)}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full font-sans text-xs font-bold ${
                          entry.kind === 'Oral'
                            ? 'bg-coral-50 text-coral-500'
                            : 'bg-sky-50 text-sky-500'
                        }`}>
                          {entry.kind}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-sans text-sm font-semibold text-charcoal">{entry.title}</td>
                      <td className="px-6 py-3 font-sans text-sm font-bold text-charcoal">{entry.score}%</td>
                      <td className="px-6 py-3 font-sans text-sm text-gray-500">
                        {entry.detail} · {formatDuration(entry.durationSec)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default Activities
