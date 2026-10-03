import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Compass, Lock, Bandage, TrendingUp, Check, Printer, SquarePen, type LucideIcon } from 'lucide-react'
import { learnerProfile, crlaLabel, crlaDescription } from '../features/teacher/dashboard/sectionData'

const TABS: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '', label: 'Overview', icon: Compass, end: true },
  { to: 'formal-assessment', label: 'Formal Assessments', icon: Lock },
  { to: 'recommendations', label: 'Intervention History', icon: Bandage },
  { to: 'activities', label: 'Practice Progress', icon: TrendingUp },
]

/**
 * Learner profile shell: back link + identity header + section tabs.
 * Rendered inside <AppLayout> so the TALAS top nav stays; no sidebar.
 * The active tab's content renders through <Outlet />.
 */
function LearnerLayout() {
  const navigate = useNavigate()
  const { learnerId } = useParams()
  const profile = learnerProfile(learnerId)
  const base = `/teacher/learners/${learnerId}`

  if (!profile) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/teacher/learners')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 font-sans text-sm text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden /> Back to Learners
        </button>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center font-sans text-gray-500">
          Learner <span className="font-semibold text-charcoal">{learnerId}</span> was not found.
        </div>
      </div>
    )
  }

  const { record } = profile

  return (
    <div className="space-y-6">
      {/* Breadcrumb / back */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-sans text-sm text-gray-500">
          <button
            type="button"
            onClick={() => navigate('/teacher/learners')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden /> Back to Learners
          </button>
          <span className="text-gray-300">/</span>
          <span>{record.grade}</span>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-charcoal">
            {record.name} ({record.id})
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sprout-50 text-sprout-500 font-sans text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-sprout-500 animate-pulse" />
          {profile.status}
        </span>
      </div>

      {/* Identity header card */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-sprout-50 text-sprout-500 flex items-center justify-center font-display text-2xl font-bold">
                {record.initials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-sprout-500 text-white flex items-center justify-center shadow-sm">
                <Check className="w-3.5 h-3.5" aria-label="Verified learner" role="img" />
              </span>
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
                {record.name}
              </h1>
              <p className="font-sans text-sm text-gray-600">
                {record.grade} — <span className="font-semibold text-charcoal">{profile.className}</span>
                <span className="mx-2 text-gray-300">•</span>
                Adviser: {profile.adviser}
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
                  Formal reading level
                </span>
                <span className="font-display text-base font-bold text-charcoal">
                  {record.level ?? '—'}
                </span>
                <span className="inline-flex px-2 py-0.5 rounded-full bg-crla-fr/15 text-crla-fr font-sans text-xs font-bold">
                  {crlaLabel(record.level)}
                </span>
              </div>
              <p className="font-display text-xs text-gray-500 leading-relaxed max-w-xl">
                {crlaDescription(record.level)}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-md bg-paper border border-gray-100 font-sans text-xs font-semibold text-charcoal">
                  PIN: {profile.pin}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-paper border border-gray-100 font-sans text-xs font-semibold text-charcoal">
                  Class Code: {profile.classCode}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-sky-50 font-sans text-xs font-semibold text-sky-500">
                  Mother Tongue: {profile.motherTongue}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              className="flex-1 lg:flex-none h-11 px-4 rounded-xl bg-paper border border-gray-200 hover:bg-gray-50 text-charcoal font-sans text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" aria-hidden /> Print Learner Card
            </button>
            <button
              type="button"
              className="flex-1 lg:flex-none h-11 px-5 rounded-xl bg-sprout-500 hover:opacity-95 text-white font-sans text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <SquarePen className="w-4 h-4" aria-hidden /> Review Assessment
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav
          aria-label="Learner sections"
          className="flex items-center gap-2 overflow-x-auto border-t border-gray-100 pt-4"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <NavLink
                key={tab.to || 'overview'}
                to={tab.to ? `${base}/${tab.to}` : base}
                end={tab.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl whitespace-nowrap font-sans text-sm inline-flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-sprout-50 text-sprout-500 font-bold'
                      : 'text-gray-600 hover:text-charcoal hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-4 h-4" aria-hidden />
                {tab.label}
              </NavLink>
            )
          })}
        </nav>
      </section>

      <Outlet context={{ learnerId }} />
    </div>
  )
}

export default LearnerLayout
