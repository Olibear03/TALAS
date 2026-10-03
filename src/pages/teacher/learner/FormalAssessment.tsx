import { useParams } from 'react-router-dom'

/** Formal Assessment tab — locked CRLA/DepEd baseline record for a learner. */
function FormalAssessment() {
  const { learnerId } = useParams()

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight">Formal Assessment</h2>
        <p className="text-on-surface-variant">
          Locked CRLA-aligned baseline for learner {learnerId}.
        </p>
      </header>
      <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm text-on-surface-variant">
        Official diagnostic record. Content to be added.
      </div>
    </section>
  )
}

export default FormalAssessment
