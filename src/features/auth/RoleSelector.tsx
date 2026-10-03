import { useNavigate } from 'react-router-dom'

interface RoleCard {
  role: 'teacher' | 'learner'
  title: string
  blurb: string
  to: string
  icon: string
  accent: 'sprout' | 'sky'
}

const ROLE_CARDS: RoleCard[] = [
  {
    role: 'teacher',
    title: 'I\u2019m a Teacher',
    blurb: 'Assign assessments, review learner work, and track progress.',
    to: '/teacher',
    icon: '\u{1F468}\u200D\u{1F3EB}',
    accent: 'sprout',
  },
  {
    role: 'learner',
    title: 'I\u2019m a Learner',
    blurb: 'Complete your assigned work, practice, and grow your streak.',
    to: '/learner/home',
    icon: '\u{1F9D1}\u200D\u{1F393}',
    accent: 'sky',
  },
]

const ACCENT: Record<RoleCard['accent'], { ring: string; chip: string; cta: string }> = {
  sprout: {
    ring: 'hover:border-sprout-500',
    chip: 'bg-sprout-50 text-sprout-500',
    cta: 'text-sprout-500',
  },
  sky: {
    ring: 'hover:border-sky-500',
    chip: 'bg-sky-50 text-sky-500',
    cta: 'text-sky-500',
  },
}

/**
 * Landing / role-selection screen. Entry point of the app at `/`.
 * Picking a role routes into that role's area.
 */
function RoleSelector() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 py-16">
      <header className="max-w-2xl text-center flex flex-col items-center gap-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sprout-50 text-sprout-500 font-sans text-sm font-bold tracking-wide">
          <span aria-hidden="true">🍃</span> TALAS
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal leading-tight">
          Teaching &amp; Learning,
          <br />
          <span className="text-sprout-500">assessed with care.</span>
        </h1>
        <p className="font-reading text-lg text-charcoal/70 max-w-xl">
          A gentle, adaptive assessment companion for teachers and learners.
          Pick how you&rsquo;re here today to get started.
        </p>
      </header>

      <section
        aria-label="Choose your role"
        className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl"
      >
        {ROLE_CARDS.map((card) => {
          const accent = ACCENT[card.accent]
          return (
            <button
              key={card.role}
              type="button"
              onClick={() => navigate(card.to)}
              className={`group text-left bg-white rounded-2xl border border-gray-200 p-7 transition-all shadow-sm hover:shadow-md ${accent.ring}`}
            >
              <span
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl ${accent.chip}`}
                aria-hidden="true"
              >
                {card.icon}
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-charcoal">
                {card.title}
              </h2>
              <p className="mt-2 font-reading text-charcoal/70">{card.blurb}</p>
              <span
                className={`mt-5 inline-flex items-center gap-1 font-sans font-semibold ${accent.cta}`}
              >
                Continue
                <span className="transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </span>
            </button>
          )
        })}
      </section>
    </main>
  )
}

export default RoleSelector
