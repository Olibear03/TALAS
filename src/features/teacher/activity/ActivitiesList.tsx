import { useNavigate } from 'react-router-dom'
import { useSubmissions } from '../dashboard/useSubmissions'
import { LEARNERS } from '../dashboard/sectionData'
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

/** Submitted learner oral-reading activities, from the real data layer. */
function ActivitiesList() {
  const navigate = useNavigate()
  const { byLearner } = useSubmissions()

  const activities: ReadingAttempt[] = Object.values(byLearner)
    .flat()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Activities</h1>
        <p className="text-on-surface-variant">
          Recent learner activity submissions.
        </p>
      </header>

      {activities.length === 0 ? (
        <div className="p-8 rounded-xl bg-surface-container-lowest shadow-sm text-center">
          <p className="text-on-surface-variant">No activity submissions yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {activities.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => navigate(`/teacher/learners/${a.learnerId}`)}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-lowest shadow-sm text-left hover:bg-surface-container-low transition-colors"
            >
              <span className="flex flex-col min-w-0">
                <span className="font-bold truncate">Oral Reading</span>
                <span className="text-sm text-on-surface-variant">
                  {learnerName(a.learnerId)} • {fmtTime(a.createdAt)} • {a.accuracy}%
                </span>
              </span>
              <span className="ml-auto px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-sm font-bold shrink-0">
                Needs Review
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivitiesList
