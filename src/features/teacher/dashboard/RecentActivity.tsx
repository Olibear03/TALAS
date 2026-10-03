import { useNavigate } from 'react-router-dom'

interface ActivityItem {
  id: string
  kind: string
  learner: string
  cohort: string
  detail: string
  time: string
  icon: string
  tone: 'sprout' | 'coral' | 'buttercup' | 'sky'
}

const FEED: ActivityItem[] = [
  {
    id: '1',
    kind: 'Silent Assessment',
    learner: 'Bea Ramos',
    cohort: 'Grade 3-A',
    detail: 'Score: 9/10 · Comprehension mastered',
    time: '10m ago',
    icon: '✅',
    tone: 'sprout',
  },
  {
    id: '2',
    kind: 'Oral Assessment',
    learner: 'Carlo Garcia',
    cohort: 'Grade 2-A',
    detail: 'Audio: 1m 42s · Needs teacher review',
    time: '25m ago',
    icon: '🎙️',
    tone: 'coral',
  },
  {
    id: '3',
    kind: 'Marungko Primer',
    learner: 'Sofia Manuel',
    cohort: 'Grade 1-B',
    detail: 'Sound check completed: 18/20 words',
    time: '45m ago',
    icon: '📖',
    tone: 'buttercup',
  },
  {
    id: '4',
    kind: 'Letter Sounds',
    learner: 'Amina Santos',
    cohort: 'Grade 1-B',
    detail: 'Set A · 90% accuracy',
    time: '1h ago',
    icon: '🔤',
    tone: 'sky',
  },
]

const TONE: Record<ActivityItem['tone'], { node: string; label: string; chip: string }> = {
  sprout: { node: 'bg-sprout-50 text-sprout-500', label: 'text-sprout-500', chip: 'bg-sprout-50 text-sprout-500' },
  coral: { node: 'bg-coral-50 text-coral-500', label: 'text-coral-500', chip: 'bg-coral-50 text-coral-500' },
  buttercup: { node: 'bg-buttercup-50 text-buttercup-500', label: 'text-buttercup-500', chip: 'bg-buttercup-50 text-buttercup-500' },
  sky: { node: 'bg-sky-50 text-sky-500', label: 'text-sky-500', chip: 'bg-sky-50 text-sky-500' },
}

function RecentActivity() {
  const navigate = useNavigate()

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-charcoal">Recent Submissions</h2>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sprout-50 text-sprout-500 font-sans text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-sprout-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Timeline */}
      <ol className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
        {FEED.map((item) => {
          const tone = TONE[item.tone]
          return (
            <li key={item.id} className="relative">
              <span
                className={`absolute -left-[30px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${tone.node}`}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-sans text-xs font-bold uppercase tracking-wide ${tone.label}`}>
                    {item.kind}
                  </span>
                  <span className="font-sans text-xs text-gray-400">{item.time}</span>
                </div>
                <p className="font-sans text-sm text-charcoal leading-snug">
                  <span className="font-bold">{item.learner}</span>{' '}
                  <span className="text-gray-400">({item.cohort})</span>
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-sans text-xs ${tone.chip}`}>
                  {item.detail}
                </span>
              </div>
            </li>
          )
        })}
      </ol>

      <button
        type="button"
        onClick={() => navigate('/teacher/activities')}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-paper hover:bg-gray-50 border border-gray-100 text-charcoal font-sans text-sm font-semibold transition-colors group"
      >
        <span>View all assessment logs</span>
        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
      </button>
    </section>
  )
}

export default RecentActivity
