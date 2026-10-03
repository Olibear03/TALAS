import { useNavigate } from 'react-router-dom'

interface Activity {
  id: string
  title: string
  learner: string
  submitted: string
  needsReview: boolean
}

const ACTIVITIES: Activity[] = []

/** Submitted learner activities with an entry point to review each one. */
function ActivitiesList() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Activities</h1>
        <p className="text-on-surface-variant">
          Recent learner activity submissions.
        </p>
      </header>

      {ACTIVITIES.length === 0 ? (
        <div className="p-8 rounded-xl bg-surface-container-lowest shadow-sm text-center">
          <p className="text-on-surface-variant">No activity submissions yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ACTIVITIES.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => navigate(`/teacher/activities/${a.id}/review`)}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-lowest shadow-sm text-left hover:bg-surface-container-low transition-colors"
            >
              <span className="flex flex-col min-w-0">
                <span className="font-bold truncate">{a.title}</span>
                <span className="text-sm text-on-surface-variant">
                  {a.learner} • {a.submitted}
                </span>
              </span>
              {a.needsReview && (
                <span className="ml-auto px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-sm font-bold shrink-0">
                  Needs Review
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivitiesList
