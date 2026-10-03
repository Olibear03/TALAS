import { learnersForSection } from './sectionData'

interface CrlaBand {
  key: 'GR' | 'LR' | 'MR' | 'FR'
  label: string
  color: string
}

const BANDS: CrlaBand[] = [
  { key: 'GR', label: 'Grade Ready', color: 'bg-crla-gr' },
  { key: 'LR', label: 'Light Refresher', color: 'bg-crla-lr' },
  { key: 'MR', label: 'Moderate Refresher', color: 'bg-crla-mr' },
  { key: 'FR', label: 'Full Refresher', color: 'bg-crla-fr' },
]

interface ClassDistributionProps {
  sectionId?: string
}

/** CRLA reading-level distribution across assessed learners in a section. */
function ClassDistribution({ sectionId = 'all' }: ClassDistributionProps) {
  const learners = learnersForSection(sectionId)

  const counts = BANDS.map((b) => ({
    ...b,
    count: learners.filter((l) => l.level === b.key).length,
  }))
  const totalAssessed = counts.reduce((sum, b) => sum + b.count, 0)

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-charcoal">Class Distribution</h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sprout-50 text-sprout-500 font-sans text-xs font-semibold">
          {totalAssessed} assessed
        </span>
      </div>

      {/* Stacked bar */}
      <div className="flex w-full h-3.5 rounded-full overflow-hidden bg-gray-100">
        {totalAssessed > 0 &&
          counts.map((b) => (
            <div
              key={b.key}
              className={b.color}
              style={{ width: `${(b.count / totalAssessed) * 100}%` }}
              title={`${b.label}: ${b.count}`}
            />
          ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {counts.map((b) => (
          <div key={b.key} className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${b.color}`} aria-hidden="true" />
            <span className="flex flex-col leading-tight">
              <span className="font-sans text-sm font-semibold text-charcoal">
                {b.count}{' '}
                <span className="font-normal text-gray-400">({b.key})</span>
              </span>
              <span className="font-sans text-xs text-gray-400">{b.label}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ClassDistribution
