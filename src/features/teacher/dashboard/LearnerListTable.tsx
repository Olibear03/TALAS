import { useNavigate } from 'react-router-dom'
import { learnersForSection, isLearnerActive, type CrlaLevel } from './sectionData'
import { useSubmissions } from './useSubmissions'
import { profileFromAccuracy } from '../../../reading/crla'
import type { ReadingAttempt } from '../../../data'

interface LearnerListTableProps {
  sectionId?: string
}

/**
 * Derives a CRLA level from a learner's submissions using the CRLA standard
 * (see reading/crla.ts). Based on the learner's best oral-reading accuracy.
 */
function levelFromAttempts(attempts: ReadingAttempt[]): CrlaLevel {
  if (attempts.length === 0) return null
  const best = Math.max(...attempts.map((a) => a.accuracy))
  return profileFromAccuracy(best)
}

/** Relative "x min/hour/day ago" from an ISO timestamp. */
function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return '—'
  const mins = Math.round((Date.now() - then) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

/** The most recent attempt's createdAt, or null. */
function latestTime(attempts: ReadingAttempt[]): string | null {
  if (attempts.length === 0) return null
  return attempts.reduce((max, a) => (a.createdAt > max ? a.createdAt : max), attempts[0].createdAt)
}

const LEVEL_META: Record<Exclude<CrlaLevel, null>, { label: string; cls: string }> = {
  GR: { label: 'Grade Ready', cls: 'bg-crla-gr/15 text-crla-gr' },
  LR: { label: 'Light Refresher', cls: 'bg-crla-lr/20 text-charcoal' },
  MR: { label: 'Moderate Refresher', cls: 'bg-crla-mr/15 text-crla-mr' },
  FR: { label: 'Full Refresher', cls: 'bg-crla-fr/15 text-crla-fr' },
}

function LevelBadge({ level }: { level: CrlaLevel }) {
  if (!level) {
    return (
      <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 font-sans text-xs font-semibold">
        Not assessed
      </span>
    )
  }
  const meta = LEVEL_META[level]
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full font-sans text-xs font-bold ${meta.cls}`}>
      {level} · {meta.label}
    </span>
  )
}

function LearnerListTable({ sectionId = 'all' }: LearnerListTableProps) {
  const navigate = useNavigate()
  const learners = learnersForSection(sectionId)
  const { byLearner } = useSubmissions()

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg font-bold text-charcoal">Learners</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sprout-50 text-sprout-500 font-sans text-xs font-semibold">
            {learners.length} shown
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/teacher/learners')}
          className="font-sans text-sm font-semibold text-sprout-500 hover:underline"
        >
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-y border-gray-100 bg-paper">
              <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Learner</th>
              <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</th>
              <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Reading Level</th>
              <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Submissions</th>
              <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {learners.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center font-sans text-sm text-gray-400">
                  No learners in this section.
                </td>
              </tr>
            ) : (
              learners.map((l) => {
                const attempts = byLearner[l.id] ?? []
                // Latest attempt first — the "to review" badge opens it directly.
                const sorted = [...attempts].sort((a, b) =>
                  a.createdAt < b.createdAt ? 1 : -1,
                )
                const latest = sorted[0]
                const level = levelFromAttempts(attempts)
                const lastTime = latestTime(attempts)
                return (
                  <tr
                    key={l.id}
                    onClick={() => navigate(`/teacher/learners/${l.id}`)}
                    className="border-b border-gray-50 last:border-0 hover:bg-paper cursor-pointer"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-sprout-50 text-sprout-500 flex items-center justify-center font-sans text-xs font-bold">
                          {l.initials}
                        </span>
                        <span className="font-sans text-sm font-semibold text-charcoal">{l.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-sans text-sm text-gray-600">{l.grade}</td>
                    <td className="px-6 py-3"><LevelBadge level={level} /></td>
                    <td className="px-6 py-3">
                      {latest ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/teacher/activities/${latest.id}/review`)
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral-50 text-coral-500 font-sans text-xs font-bold hover:bg-coral-100 transition-colors"
                        >
                          {attempts.length} to review
                        </button>
                      ) : (
                        <span className="font-sans text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {isLearnerActive(l.id) ? (
                        <span className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-sprout-500">
                          <span className="w-2 h-2 rounded-full bg-sprout-500 animate-pulse" />
                          Now
                        </span>
                      ) : (
                        <span className="font-sans text-sm text-gray-400">
                          {lastTime ? timeAgo(lastTime) : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default LearnerListTable
