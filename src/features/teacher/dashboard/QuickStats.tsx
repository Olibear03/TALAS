import { useDashboardStats } from './useDashboardStats'

interface StatCard {
  icon: string
  value: string
  label: string
  sublabel: string
}

interface QuickStatsProps {
  sectionId?: string
}

function QuickStats({ sectionId = 'all' }: QuickStatsProps) {
  const stats = useDashboardStats(sectionId)

  const assessedPct =
    stats.totalLearners > 0
      ? Math.round((stats.assessedCount / stats.totalLearners) * 100)
      : 0

  const cards: StatCard[] = [
    {
      icon: '👥',
      value: String(stats.totalLearners),
      label: 'Total Learners',
      sublabel: sectionId === 'all' ? 'across all sections' : 'in this section',
    },
    {
      icon: '📊',
      value: `${stats.assessedCount} / ${stats.totalLearners}`,
      label: 'Assessed',
      sublabel: `${assessedPct}% assessed`,
    },
    {
      icon: '⚠️',
      value: String(stats.needSupportCount),
      label: 'Need Support',
      sublabel: 'MR + FR learners',
    },
    {
      icon: '⚡',
      value: String(stats.activeTodayCount),
      label: 'Active Today',
      sublabel: 'in last 24 hours',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-1"
        >
          <span className="text-2xl" aria-hidden="true">
            {card.icon}
          </span>
          <span className="mt-1 text-3xl font-sans font-bold text-charcoal">
            {card.value}
          </span>
          <span className="text-sm font-sans font-medium text-gray-600">
            {card.label}
          </span>
          <span className="text-xs font-sans text-gray-400">{card.sublabel}</span>
        </article>
      ))}
    </div>
  )
}

export default QuickStats
