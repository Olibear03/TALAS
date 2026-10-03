import { useNavigate } from 'react-router-dom'
import { ArrowRight, Mic } from 'lucide-react'
import { useSubmissions } from './useSubmissions'
import { LEARNERS } from './sectionData'
import type { ReadingAttempt } from '../../../data'

function learnerName(id: string): string {
  return LEARNERS.find((l) => l.id === id)?.name ?? id
}

function fmtTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function toneForAccuracy(pct: number): string {
  if (pct >= 80) return 'bg-sprout-50 text-sprout-500'
  if (pct >= 60) return 'bg-sky-50 text-sky-500'
  return 'bg-coral-50 text-coral-500'
}

/**
 * Recent learner submissions — the latest oral reading attempts across all
 * learners, pulled from the real data layer. Each item opens that learner's
 * profile.
 */
function RecentActivity() {
  const navigate = useNavigate()
  const { byLearner } = useSubmissions()

  // Flatten every learner's attempts, newest first, take the latest few.
  const feed: ReadingAttempt[] = Object.values(byLearner)
    .flat()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 6)

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-charcoal">Recent Submissions</h2>
        {feed.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sprout-50 text-sprout-500 font-sans text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-sprout-500 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {feed.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-sans text-sm text-gray-500">No submissions yet.</p>
          <p className="font-sans text-xs text-gray-400 mt-1">
            Learner submissions will appear here once they complete their work.
          </p>
        </div>
      ) : (
        <ol className="flex flex-col gap-2">
          {feed.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => navigate(`/teacher/activities/${a.id}/review`)}
                title={`Review ${learnerName(a.learnerId)}'s reading`}
                className="group w-full flex items-center gap-3 p-3 rounded-xl bg-paper border border-gray-100 hover:bg-gray-50 hover:shadow-sm text-left transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-coral-50 text-coral-500 flex items-center justify-center shrink-0">
                  <Mic className="w-4 h-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans text-xs font-bold uppercase tracking-wide text-coral-500">
                      Oral Reading
                    </span>
                    <span className="font-sans text-xs text-gray-400 shrink-0">
                      {fmtTime(a.createdAt)}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-charcoal leading-snug mt-0.5">
                    <span className="font-bold group-hover:text-sprout-500 transition-colors">
                      {learnerName(a.learnerId)}
                    </span>
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md font-sans text-xs font-semibold mt-1 ${toneForAccuracy(a.accuracy)}`}
                  >
                    {a.accuracy}% · {a.correctWords}/{a.totalWords}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ol>
      )}

      <button
        type="button"
        onClick={() => navigate('/teacher/activities')}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-paper hover:bg-gray-50 border border-gray-100 text-charcoal font-sans text-sm font-semibold transition-colors group"
      >
        <span>View all assessment logs</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </button>
    </section>
  )
}

export default RecentActivity
