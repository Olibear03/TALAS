import { useParams } from 'react-router-dom'
import {
  learnerProfile,
  crlaLabel,
  type RecentActivityItem,
} from '../../../features/teacher/dashboard/sectionData'

const ACTIVITY_META: Record<
  RecentActivityItem['type'],
  { icon: string; chip: string }
> = {
  'Formal Assessment': { icon: '🔒', chip: 'bg-sprout-50 text-sprout-500' },
  Practice: { icon: '✨', chip: 'bg-sky-50 text-sky-500' },
  Intervention: { icon: '🩹', chip: 'bg-buttercup-50 text-buttercup-500' },
}

/** Overview tab — current reading situation across formal, practice, and intervention. */
function Overview() {
  const { learnerId } = useParams()
  const profile = learnerProfile(learnerId)

  if (!profile) return null
  const { record, formal, practice, intervention, recentActivity } = profile

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------ */}
      {/* 1. FORMAL ASSESSMENT SNAPSHOT — official, finalized, locked   */}
      {/* ------------------------------------------------------------ */}
      <section className="bg-white rounded-2xl border-2 border-sprout-500/30 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-3 bg-sprout-50 border-b border-sprout-500/20">
          <span className="text-lg" aria-hidden="true">🔒</span>
          <h2 className="font-display text-base font-bold text-charcoal">
            Formal Assessment Snapshot
          </h2>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-sprout-500 font-sans text-xs font-bold">
            ✓ Finalized official record
          </span>
        </div>

        {formal ? (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-paper border border-gray-100 rounded-xl p-4 space-y-1">
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  Formal reading level
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-bold text-charcoal">
                    {record.level ?? '—'}
                  </span>
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-crla-fr/15 text-crla-fr font-sans text-xs font-bold">
                    {crlaLabel(record.level)}
                  </span>
                </div>
                <p className="font-sans text-sm text-gray-600">{formal.readerStage}</p>
              </div>

              <div className="bg-paper border border-gray-100 rounded-xl p-4 space-y-1">
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  Latest assessment date
                </span>
                <p className="font-sans text-sm font-bold text-charcoal">{formal.dateFinalized}</p>
                <p className="font-sans text-xs text-gray-500">{formal.period}</p>
                <p className="font-sans text-xs text-gray-400">Assessed by {formal.assessor}</p>
              </div>

              <div className="bg-paper border border-gray-100 rounded-xl p-4 space-y-1">
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  Key result / evidence
                </span>
                <p className="font-sans text-sm font-bold text-charcoal">{formal.miscues}</p>
                <p className="font-sans text-xs text-gray-500">{formal.comprehension}</p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-sans text-xs text-gray-400">Phonemes:</span>
                  {formal.phonemesFlagged.map((p) => (
                    <span
                      key={p}
                      className="px-1.5 py-0.5 bg-crla-fr/15 text-crla-fr rounded font-sans text-xs font-bold"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="font-sans text-xs text-gray-400 flex items-center gap-1.5">
              🛡️ Locked evidence — classification: {formal.classification}. Practice sessions do
              not overwrite this baseline.
            </p>
          </div>
        ) : (
          <p className="p-6 font-sans text-sm text-gray-400">
            No formal assessment on record yet.
          </p>
        )}
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 2. CURRENT PRACTICE — adaptive, clearly separate from formal  */}
      {/* ------------------------------------------------------------ */}
      <section className="bg-white rounded-2xl border border-dashed border-sky-500/40 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-3 bg-sky-50 border-b border-sky-500/20">
          <span className="text-lg" aria-hidden="true">✨</span>
          <h2 className="font-display text-base font-bold text-charcoal">Current Practice</h2>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-sky-500 font-sans text-xs font-bold">
            Adaptive · not a formal record
          </span>
        </div>

        {practice ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-sky-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  Current practice difficulty
                </span>
                <p className="font-sans text-sm font-bold text-charcoal">{practice.level}</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-white text-sky-500 font-sans text-xs font-bold shrink-0">
                {practice.domain}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-semibold text-charcoal">
                  Recent practice performance
                </span>
                <span className="font-sans text-xs text-gray-400">Last 3 sessions</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {practice.recentAccuracy.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center gap-2 p-3 bg-paper border border-gray-100 rounded-xl"
                  >
                    <div className="w-full flex items-end justify-center h-20 bg-white rounded-lg p-1.5">
                      <div
                        className="w-full bg-sky-500 rounded-md transition-all duration-500"
                        style={{ height: `${s.pct}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <span className="font-display text-base font-bold text-charcoal">
                        {s.pct}%
                      </span>
                      <p className="font-sans text-xs text-gray-400">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-sans text-xs text-gray-500 bg-sky-50/60 rounded-lg px-3 py-2">
              {practice.note}
            </p>
          </div>
        ) : (
          <p className="p-6 font-sans text-sm text-gray-400">
            No practice sessions recorded yet.
          </p>
        )}
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 3 + 4. Intervention and Recent Activity (two columns)         */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intervention */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">🩹</span>
            <h2 className="font-display text-base font-bold text-charcoal">Intervention</h2>
          </div>

          {intervention ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-bold text-charcoal">
                  {intervention.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-buttercup-50 text-buttercup-500 font-sans text-xs font-bold">
                  {intervention.tier}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-paper border border-gray-100">
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  Target skill / need
                </span>
                <p className="font-sans text-sm text-gray-600">{intervention.description}</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-sans text-xs">
                  <span className="text-gray-400">
                    {intervention.directive} · progress
                  </span>
                  <span className="font-bold text-sprout-500">
                    {intervention.modulesCompleted}/{intervention.modulesTotal} modules
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: intervention.modulesTotal }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 rounded-full ${
                        i < intervention.modulesCompleted ? 'bg-sprout-500' : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="font-sans text-xs text-gray-400">Next: {intervention.nextSession}</p>
            </div>
          ) : (
            <p className="font-sans text-sm text-gray-400">No active intervention assigned.</p>
          )}
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">🕑</span>
            <h2 className="font-display text-base font-bold text-charcoal">Recent Activity</h2>
          </div>

          {recentActivity.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {recentActivity.map((a, i) => {
                const meta = ACTIVITY_META[a.type]
                return (
                  <li
                    key={`${a.date}-${i}`}
                    className="flex items-start gap-3 p-3 rounded-xl bg-paper border border-gray-100"
                  >
                    <span
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-full font-sans text-xs font-bold ${meta.chip}`}>
                          {a.type}
                        </span>
                        <span className="font-sans text-xs text-gray-400 shrink-0">{a.date}</span>
                      </div>
                      <p className="font-sans text-sm font-semibold text-charcoal mt-1">{a.label}</p>
                      <p className="font-sans text-xs text-gray-500">{a.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="font-sans text-sm text-gray-400">No recent activity recorded yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default Overview
