import { useParams } from 'react-router-dom'

/** Activities tab — practice sessions and activity history for a learner. */
function Activities() {
  const { learnerId } = useParams()

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight">Activities</h2>
        <p className="text-on-surface-variant">
          Practice sessions and activity history for learner {learnerId}.
        </p>
      </header>
      <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm text-on-surface-variant">
        No activity records yet. Content to be added.
      </div>
    </section>
  )
}

export default Activities
