import { NavLink, Outlet, useNavigate } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: string
  end?: boolean
}

const TEACHER_NAV: NavItem[] = [
  { to: '/teacher', label: 'Dashboard', icon: '', end: true },
  { to: '/teacher/learners', label: 'Learners', icon: '' },
  { to: '/teacher/assessments', label: 'Assessments', icon: '' },
  { to: '/teacher/recommendations', label: 'Recommendations', icon: '' },
  { to: '/teacher/activities', label: 'Activities', icon: '' },
  { to: '/teacher/reports', label: 'Reports', icon: '' },
]

/**
 * App shell for the teacher area: a horizontal top navigation bar with the
 * active page rendered full-width (centered, max-width) through <Outlet />.
 * Pages supply their own content only.
 */
function AppLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-paper text-charcoal">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Brand + profile row */}
          <div className="h-16 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 shrink-0"
            >
              <span className="text-xl" aria-hidden="true">🍃</span>
              <span className="font-display text-lg font-bold text-charcoal">TALAS</span>
              <span className="hidden sm:inline font-sans text-sm text-gray-400">
                · Basa &amp; Tuklas
              </span>
            </button>

            {/* Primary nav — inline on desktop */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Teacher navigation"
            >
              {TEACHER_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-xl font-sans text-sm font-medium transition-colors ${
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

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sprout-50 text-sprout-500 font-sans text-xs font-semibold">
                SY 2026–2027
              </span>
              <span className="flex items-center gap-2">
                <span className="hidden md:flex flex-col leading-tight text-right">
                  <span className="font-sans text-sm font-semibold text-charcoal">Teacher Maria</span>
                  <span className="font-sans text-xs text-gray-400">Grades 1–3</span>
                </span>
                <span className="w-9 h-9 rounded-full bg-sprout-500 text-white flex items-center justify-center font-sans font-bold">
                  M
                </span>
              </span>
            </div>
          </div>

          {/* Primary nav — scrollable row on tablet/mobile */}
          <nav
            className="lg:hidden flex items-center gap-1 pb-2 -mt-1 overflow-x-auto"
            aria-label="Teacher navigation"
          >
            {TEACHER_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-xl font-sans text-sm font-medium whitespace-nowrap transition-colors ${
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
        </div>
      </header>

      {/* Full-width centered content */}
      <main className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
