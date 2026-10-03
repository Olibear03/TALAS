interface CrlaBand {
  key: 'gr' | 'lr' | 'mr' | 'fr'
  label: string
  short: string
  count: number
  color: string
}

const TOTAL_ASSESSED = 20

const BANDS: CrlaBand[] = [
  { key: 'gr', label: 'Grade Ready', short: 'GR', count: 7, color: 'bg-crla-gr' },
  { key: 'lr', label: 'Light Refresher', short: 'LR', count: 5, color: 'bg-crla-lr' },
  { key: 'mr', label: 'Moderate Refresher', short: 'MR', count: 5, color: 'bg-crla-mr' },
  { key: 'fr', label: 'Full Refresher', short: 'FR', count: 3, color: 'bg-crla-fr' },
]

/** CRLA reading-level distribution across assessed learners. */
function ClassDistribution() {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-charcoal">Class Distribution</h2>
        <span className="font-sans text-xs text-gray-400">{TOTAL_ASSESSED} assessed</span>
      </div>

      {/* Stacked bar */}
      <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-100">
        {BANDS.map((b) => (
          <div
            key={b.key}
            className={b.color}
            style={{ width: `${(b.count / TOTAL_ASSESSED) * 100}%` }}
            title={`${b.label}: ${b.count}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {BANDS.map((b) => (
          <div key={b.key} className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${b.color}`} aria-hidden="true" />
            <span className="flex flex-col leading-tight">
              <span className="font-sans text-sm font-semibold text-charcoal">
                {b.count}{' '}
                <span className="font-normal text-gray-400">({b.short})</span>
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
