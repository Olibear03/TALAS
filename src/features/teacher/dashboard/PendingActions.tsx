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
    detail: 'Submitted in the last 2 days · requires audio playback',
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

const TONE: Record<PendingAction['tone'], { chip: string; bar: string }> = {
  coral: { chip: 'bg-coral-50 text-coral-500', bar: 'bg-coral-500' },
  buttercup: { chip: 'bg-buttercup-50 text-buttercup-500', bar: 'bg-buttercup-500' },
  sky: { chip: 'bg-sky-50 text-sky-500', bar: 'bg-sky-500' },
}

function PendingActions() {
  const navigate = useNavigate()

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg font-bold text-charcoal">Pending Actions</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-coral-50 text-coral-500 font-sans text-xs font-semibold">
            {ACTIONS.length} need attention
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {ACTIONS.map((a) => {
          const tone = TONE[a.tone]
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => navigate(a.to)}
              className="group relative flex items-center gap-4 p-4 rounded-xl bg-paper hover:bg-gray-50 border border-gray-100 hover:shadow-sm text-left transition-all overflow-hidden"
            >
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${tone.bar}`} aria-hidden="true" />
              <span
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl text-lg shrink-0 ${tone.chip}`}
                aria-hidden="true"
              >
                {a.icon}
              </span>
              <span className="flex flex-col min-w-0">
                <span className="font-sans text-sm font-semibold text-charcoal">{a.title}</span>
                <span className="font-sans text-xs text-gray-400">{a.detail}</span>
              </span>
              <span className="ml-auto text-gray-300 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                →
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default PendingActions
