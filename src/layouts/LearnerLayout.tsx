import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'

const TABS: { to: string; label: string; end?: boolean }[] = [
  { to: '', label: 'Overview', end: true },
  { to: 'formal-assessment', label: 'Formal Assessment' },
  { to: 'recommendations', label: 'Recommendations' },
  { to: 'activities', label: 'Activities' },
  { to: 'development-profile', label: 'Development Profile' },
]

/** Shared chrome for a single learner's detail tabs. */
function LearnerLayout() {
  const navigate = useNavigate()
  const { learnerId } = useParams()
  const base = `/teacher/learners/${learnerId}`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/teacher/learners')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 font-sans text-sm text-charcoal transition-colors"
        >
          ← Back to Learners
        </button>
        <span className="font-sans text-sm text-gray-500">Learner {learnerId}</span>
      </div>

      <nav
        aria-label="Learner sections"
        className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 pb-2"
      >
        {TABS.map((tab) => (
          <NavLink
            key={tab.to || 'overview'}
            to={tab.to ? `${base}/${tab.to}` : base}
            end={tab.end}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg whitespace-nowrap font-sans text-sm transition-colors ${
                isActive
                  ? 'bg-sprout-50 text-sprout-500 font-bold'
                  : 'text-gray-600 hover:text-charcoal hover:bg-gray-50'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}

export default LearnerLayout
