import { useParams } from 'react-router-dom'
import { learnerProfile, crlaLabel } from '../../../features/teacher/dashboard/sectionData'

function Card({
  title,
  icon,
  children,
}: {
  title: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <h2 className="font-display text-base font-bold text-charcoal">{title}</h2>
      </div>
      {children}
    </section>
  )
}

/** Overview tab — summary of formal level, latest assessment, practice, intervention. */
function Overview() {
  const { learnerId } = useParams()
  const profile = learnerProfile(learnerId)

  if (!profile) return null
  const { record, formal, practice, intervention } = profile

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Current formal reading level / status */}
      <Card title="Current Reading Level" icon="📘">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex px-2.5 py-1 rounded-full bg-crla-fr/15 text-crla-fr font-sans text-xs font-bold">
              {crlaLabel(record.level)}
            </span>
            <p className="font-sans text-sm text-gray-600">
              {formal ? formal.readerStage : 'No formal classification yet.'}
            </p>
          </div>
          <span className="font-display text-3xl font-bold text-charcoal">
            {record.level ?? '—'}
          </span>
        </div>
        <p className="font-sans text-xs text-gray-400">
          Status: {profile.status} · {record.grade} · {profile.className}
        </p>
      </Card>

      {/* 2. Latest formal assessment */}
      <Card title="Latest Formal Assessment" icon="🔒">
        {formal ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm font-semibold text-charcoal">{formal.period}</span>
              <span className="px-2 py-0.5 rounded bg-sprout-50 text-sprout-500 font-sans text-xs font-bold">
                CRLA Validated
              </span>
            </div>
            <p className="font-sans text-sm text-gray-600">{formal.classification}</p>
            <div className="flex flex-col gap-0.5 font-sans text-xs text-gray-400">
              <span>Finalized {formal.dateFinalized}</span>
              <span>Assessed by {formal.assessor}</span>
              <span>{formal.miscues} · {formal.comprehension}</span>
            </div>
          </div>
        ) : (
          <p className="font-sans text-sm text-gray-400">No formal assessment on record yet.</p>
        )}
      </Card>

      {/* 3. Current practice level */}
      <Card title="Current Practice Level" icon="✨">
        {practice ? (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-paper border border-gray-100">
              <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">Target tier</span>
              <p className="font-sans text-sm font-bold text-charcoal">{practice.level}</p>
            </div>
            <div className="flex items-center justify-between font-sans text-xs text-gray-400">
              <span>{practice.domain}</span>
              <span>
                Recent: {practice.recentAccuracy.map((s) => `${s.pct}%`).join(' · ')}
              </span>
            </div>
          </div>
        ) : (
          <p className="font-sans text-sm text-gray-400">No practice sessions recorded yet.</p>
        )}
      </Card>

      {/* 4. Assigned intervention */}
      <Card title="Assigned Intervention" icon="🩹">
        {intervention ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm font-bold text-charcoal">{intervention.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-buttercup-50 text-buttercup-500 font-sans text-xs font-bold">
                {intervention.tier}
              </span>
            </div>
            <p className="font-sans text-sm text-gray-600">{intervention.description}</p>
            <div className="flex items-center justify-between font-sans text-xs text-gray-400">
              <span>{intervention.directive}</span>
              <span>
                {intervention.modulesCompleted}/{intervention.modulesTotal} modules
              </span>
            </div>
            <p className="font-sans text-xs text-gray-400">Next: {intervention.nextSession}</p>
          </div>
        ) : (
          <p className="font-sans text-sm text-gray-400">No active intervention assigned.</p>
        )}
      </Card>
    </div>
  )
}

export default Overview
