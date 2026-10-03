import { NavLink, Outlet, useNavigate } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: string
  end?: boolean
}

const TEACHER_NAV: NavItem[] = [
  { to: '/teacher', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/teacher/learners', label: 'Learners', icon: '👥' },
  { to: '/teacher/assessments', label: 'Assessments', icon: '📊' },
  { to: '/teacher/recommendations', label: 'Recommendations', icon: '💡' },
  { to: '/teacher/activities', label: 'Activities', icon: '⚡' },
  { to: '/teacher/reports', label: 'Reports', icon: '📈' },
]

/**
 * App shell for the teacher area: fixed sidebar + top bar, with the active
 * page rendered through <Outlet />. Pages supply their own content only.
 */
function AppLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-paper text-charcoal">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex-col hidden lg:flex">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="h-16 px-6 flex items-center gap-2 border-b border-gray-100"
        >
          <span className="text-xl" aria-hidden="true">🍃</span>
          <span className="font-display text-lg font-bold text-charcoal">TALAS</span>
        </button>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Teacher navigation">
          {TEACHER_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sprout-50 text-sprout-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-charcoal'
                }`
              }
            >
              <span className="text-base" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="w-9 h-9 rounded-full bg-sprout-500 text-white flex items-center justify-center font-sans font-bold">
              M
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-sans text-sm font-semibold text-charcoal">Teacher Maria</span>
              <span className="font-sans text-xs text-gray-400">Grades 1–3</span>
            </span>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 bg-paper/80 backdrop-blur border-b border-gray-200 flex items-center justify-between px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 lg:hidden"
          >
            <span className="text-xl" aria-hidden="true">🍃</span>
            <span className="font-display text-lg font-bold text-charcoal">TALAS</span>
          </button>

          <div className="hidden lg:block font-sans text-sm text-gray-500">
            TALAS · Basa &amp; Tuklas
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sprout-50 text-sprout-500 font-sans text-xs font-semibold">
              SY 2026–2027
            </span>
            <span className="w-9 h-9 rounded-full bg-sprout-500 text-white flex items-center justify-center font-sans font-bold">
              M
            </span>
          </div>
        </header>

        <main className="px-6 py-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
