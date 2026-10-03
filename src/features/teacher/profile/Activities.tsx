import { useParams } from 'react-router-dom'
import { TrendingUp, Minus, TrendingDown, Sparkles, BarChart3, Clock, type LucideIcon } from 'lucide-react'
import {
  learnerProfile,
  type PracticeTrend,
} from '../dashboard/sectionData'

const TREND_META: Record<PracticeTrend, { icon: LucideIcon; chip: string }> = {
  Improving: { icon: TrendingUp, chip: 'bg-sprout-50 text-sprout-500' },
  Steady: { icon: Minus, chip: 'bg-sky-50 text-sky-500' },
  'Needs attention': { icon: TrendingDown, chip: 'bg-coral-50 text-coral-500' },
}

/** Practice Progress tab — adaptive practice, performance, and history. Not a formal result. */
function Activities() {
  const { learnerId } = useParams()
  const profile = learnerProfile(learnerId)
  const practice = profile?.practice ?? null

  if (!practice) {
    return (
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-charcoal" aria-hidden />
          <h2 className="font-display text-lg font-bold text-charcoal">Practice Progress</h2>
        </div>
        <p className="font-sans text-sm text-gray-400">No practice sessions recorded for this learner yet.</p>
      </section>
    )
  }

  const trend = TREND_META[practice.trend]
  const TrendIcon = trend.icon

  return (
    <div className="space-y-6">
      {/* Current level + trend */}
      <section className="bg-white rounded-2xl border border-dashed border-sky-500/40 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 px-6 py-3 bg-sky-50 border-b border-sky-500/20">
          <Sparkles className="w-5 h-5 text-charcoal" aria-hidden />
          <h2 className="font-display text-base font-bold text-charcoal">Practice Progress</h2>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-sky-500 font-sans text-xs font-bold">
            Adaptive · not a formal result
          </span>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">Current practice difficulty</span>
              <p className="font-sans text-sm font-bold text-charcoal">{practice.level}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-500 font-sans text-xs font-bold">
                {practice.domain}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans text-xs font-bold ${trend.chip}`}>
                <TrendIcon className="w-4 h-4" aria-hidden />
                {practice.trend}
              </span>
            </div>
          </div>


          <p className="font-sans text-xs text-gray-500 bg-sky-50/60 rounded-lg px-3 py-2">{practice.note}</p>
        </div>
      </section>

      {/* Progress over time — simple trend chart from activity history */}
      {practice.history.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-charcoal" aria-hidden />
            <h2 className="font-display text-base font-bold text-charcoal">Progress Over Time</h2>
          </div>

          {/* Chronological (oldest -> newest) bar trend */}
          <div className="flex items-end gap-3 h-32">
            {[...practice.history].reverse().map((h) => (
              <div key={`${h.date}-${h.activity}`} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div className="w-full flex items-end justify-center h-24 bg-paper border border-gray-100 rounded-lg p-1.5">
                  <div className="w-full bg-sprout-500 rounded-md transition-all duration-500" style={{ height: `${h.accuracyPct}%` }} />
                </div>
                <span className="font-sans text-xs font-bold text-charcoal">{h.accuracyPct}%</span>
                <span className="font-sans text-[10px] text-gray-400 truncate w-full text-center">{h.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Practice activity history */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4">
          <Clock className="w-5 h-5 text-charcoal" aria-hidden />
          <h2 className="font-display text-base font-bold text-charcoal">Practice Activity History</h2>
          <span className="ml-auto font-sans text-xs text-gray-400">{practice.history.length} sessions</span>
        </div>

        {practice.history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-y border-gray-100 bg-paper">
                  <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Activity</th>
                  <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Accuracy</th>
                  <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Detail</th>
                </tr>
              </thead>
              <tbody>
                {practice.history.map((h) => (
                  <tr key={`${h.date}-${h.activity}`} className="border-b border-gray-50 last:border-0">
                    <td className="px-6 py-3 font-sans text-sm text-gray-600">{h.date}</td>
                    <td className="px-6 py-3 font-sans text-sm font-semibold text-charcoal">{h.activity}</td>
                    <td className="px-6 py-3">
                      <span className="font-sans text-sm font-bold text-charcoal">{h.accuracyPct}%</span>
                    </td>
                    <td className="px-6 py-3 font-sans text-sm text-gray-500">{h.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 pb-6 font-sans text-sm text-gray-400">No practice activity on record yet.</p>
        )}
      </section>
    </div>
  )
}

export default Activities
