import { useParams } from 'react-router-dom'

/** Development Profile tab — longitudinal growth view for a learner. */
function DevelopmentProfile() {
  const { learnerId } = useParams()

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight">Development Profile</h2>
        <p className="text-on-surface-variant">
          Longitudinal literacy growth for learner {learnerId}.
        </p>
      </header>
      <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm text-on-surface-variant">
        Growth timeline to be added.
      </div>
    </section>
  )
}

export default DevelopmentProfile
