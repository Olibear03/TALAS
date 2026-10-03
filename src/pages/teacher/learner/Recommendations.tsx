import { useParams } from 'react-router-dom'
import { learnerProfile } from '../../../features/teacher/dashboard/sectionData'

/** Intervention History tab — assigned remediation plan and progress. */
function Recommendations() {
  const { learnerId } = useParams()
  const profile = learnerProfile(learnerId)
  const intervention = profile?.intervention ?? null

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">🩹</span>
        <h2 className="font-display text-lg font-bold text-charcoal">Intervention History</h2>
      </div>

      {intervention ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-paper border border-gray-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">Plan directive</span>
              <span className="px-2 py-0.5 rounded-full bg-buttercup-50 text-buttercup-500 font-sans text-xs font-bold">
                {intervention.tier}
              </span>
            </div>
            <p className="font-sans text-base font-bold text-charcoal">{intervention.title}</p>
            <p className="font-sans text-sm text-gray-600">{intervention.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between font-sans text-sm">
              <span className="font-semibold text-charcoal">Module completion</span>
              <span className="font-bold text-sprout-500">
                {intervention.modulesCompleted} of {intervention.modulesTotal}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: intervention.modulesTotal }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full ${i < intervention.modulesCompleted ? 'bg-sprout-500' : 'bg-gray-100'}`}
                />
              ))}
            </div>
          </div>

          <p className="font-sans text-xs text-gray-400">Next guided pull-out: {intervention.nextSession}</p>
        </div>
      ) : (
        <p className="font-sans text-sm text-gray-400">No interventions recorded for this learner yet.</p>
      )}
    </section>
  )
}

export default Recommendations
