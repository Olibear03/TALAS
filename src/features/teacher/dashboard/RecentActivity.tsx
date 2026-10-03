interface ActivityItem {
  id: string
  learner: string
  initials: string
  action: string
  detail: string
  time: string
  tone: 'sprout' | 'coral' | 'buttercup' | 'sky'
}

const FEED: ActivityItem[] = [
  {
    id: '1',
    learner: 'Bea Ramos',
    initials: 'BR',
    action: 'completed a silent assessment',
    detail: 'Score 9/10 · Comprehension mastered',
    time: '10m ago',
    tone: 'sprout',
  },
  {
    id: '2',
    learner: 'Carlo Garcia',
    initials: 'CG',
    action: 'submitted an oral recording',
    detail: '1m 42s · Needs review',
    time: '25m ago',
    tone: 'coral',
  },
  {
    id: '3',
    learner: 'Sofia Manuel',
    initials: 'SM',
    action: 'finished a Marungko primer',
    detail: 'Sound check 18/20 words',
    time: '45m ago',
    tone: 'buttercup',
  },
  {
    id: '4',
    learner: 'Amina Santos',
    initials: 'AS',
    action: 'practiced letter sounds',
    detail: 'Set A · 90% accuracy',
    time: '1h ago',
    tone: 'sky',
  },
]

const TONE: Record<ActivityItem['tone'], string> = {
  sprout: 'bg-sprout-50 text-sprout-500',
  coral: 'bg-coral-50 text-coral-500',
  buttercup: 'bg-buttercup-50 text-buttercup-500',
  sky: 'bg-sky-50 text-sky-500',
}

function RecentActivity() {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-charcoal">Recent Activity</h2>
        <span className="inline-flex items-center gap-1.5 font-sans text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-sprout-500 animate-pulse" />
          Live
        </span>
      </div>

      <ul className="flex flex-col gap-1">
        {FEED.map((item) => (
          <li key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center font-sans text-xs font-bold shrink-0 ${TONE[item.tone]}`}
            >
              {item.initials}
            </span>
            <span className="flex flex-col min-w-0">
              <span className="font-sans text-sm text-charcoal">
                <span className="font-semibold">{item.learner}</span> {item.action}
              </span>
              <span className="font-sans text-xs text-gray-400">{item.detail}</span>
            </span>
            <span className="ml-auto font-sans text-xs text-gray-400 shrink-0">{item.time}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RecentActivity
