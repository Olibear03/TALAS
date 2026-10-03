import { useParams } from 'react-router-dom'
import { learnerProfile } from '../../../features/teacher/dashboard/sectionData'

/** Practice Progress tab — adaptive practice level and recent accuracy. */
function Activities() {
  const { learnerId } = useParams()
  const profile = learnerProfile(learnerId)
  const practice = profile?.practice ?? null

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">📈</span>
        <h2 className="font-display text-lg font-bold text-charcoal">Practice Progress</h2>
      </div>

      {practice ? (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-paper border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">Target difficulty tier</span>
              <p className="font-sans text-sm font-bold text-charcoal">{practice.level}</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-500 font-sans text-xs font-bold">
              {practice.domain}
            </span>
          </div>

          <div className="space-y-2">
            <span className="font-sans text-sm font-semibold text-charcoal">Recent practice accuracy</span>
            <div className="grid grid-cols-3 gap-3">
              {practice.recentAccuracy.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2 p-3 bg-paper border border-gray-100 rounded-xl">
                  <div className="w-full flex items-end justify-center h-24 bg-white rounded-lg p-1.5">
                    <div className="w-full bg-sprout-500 rounded-md transition-all duration-500" style={{ height: `${s.pct}%` }} />
                  </div>
                  <div className="text-center">
                    <span className="font-display text-lg font-bold text-charcoal">{s.pct}%</span>
                    <p className="font-sans text-xs text-gray-400">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sprout-50 flex items-start gap-3">
            <span aria-hidden="true">📈</span>
            <p className="font-sans text-sm text-charcoal/80">{practice.note}</p>
          </div>
        </div>
      ) : (
        <p className="font-sans text-sm text-gray-400">No practice sessions recorded for this learner yet.</p>
      )}
    </section>
  )
}

export default Activities
