import { useParams } from 'react-router-dom'

/** Recommendations tab — intervention and next-step recommendations for a learner. */
function Recommendations() {
  const { learnerId } = useParams()

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight">Recommendations</h2>
        <p className="text-on-surface-variant">
          Suggested interventions and next steps for learner {learnerId}.
        </p>
      </header>
      <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm text-on-surface-variant">
        No recommendations yet. Content to be added.
      </div>
    </section>
  )
}

export default Recommendations
