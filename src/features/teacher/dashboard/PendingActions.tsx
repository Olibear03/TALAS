import { useNavigate } from 'react-router-dom'

interface PendingAction {
  id: string
  icon: string
  title: string
  detail: string
  to: string
  tone: 'coral' | 'buttercup' | 'sky'
}

const ACTIONS: PendingAction[] = [
  {
    id: 'reviews',
    icon: '🎧',
    title: '4 oral assessments to review',
    detail: 'Submitted in the last 2 days',
    to: '/teacher/activities',
    tone: 'coral',
  },
  {
    id: 'recs',
    icon: '💡',
    title: '3 recommendations pending',
    detail: 'Approve or dismiss suggested next steps',
    to: '/teacher/recommendations',
    tone: 'buttercup',
  },
  {
    id: 'assign',
    icon: '📊',
    title: '8 learners awaiting assessment',
    detail: 'Not yet assessed this quarter',
    to: '/teacher/assessments',
    tone: 'sky',
  },
]

const TONE: Record<PendingAction['tone'], string> = {
  coral: 'bg-coral-50 text-coral-500',
  buttercup: 'bg-buttercup-50 text-buttercup-500',
  sky: 'bg-sky-50 text-sky-500',
}

function PendingActions() {
  const navigate = useNavigate()

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-charcoal">Pending Actions</h2>
        <span className="font-sans text-xs text-gray-400">{ACTIONS.length} items</span>
      </div>

      <div className="flex flex-col gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => navigate(a.to)}
            className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-left transition-colors"
          >
            <span
              className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg shrink-0 ${TONE[a.tone]}`}
              aria-hidden="true"
            >
              {a.icon}
            </span>
            <span className="flex flex-col min-w-0">
              <span className="font-sans text-sm font-semibold text-charcoal">{a.title}</span>
              <span className="font-sans text-xs text-gray-400">{a.detail}</span>
            </span>
            <span className="ml-auto text-gray-300" aria-hidden="true">›</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default PendingActions
