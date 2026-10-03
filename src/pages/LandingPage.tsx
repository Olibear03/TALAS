import './LandingPage.css'

export interface LandingPageProps {
  /**
   * Called when a role card is chosen. Wired to router navigation in Task 7.
   * Falls back to a plain anchor href when not provided, so the page works
   * standalone before routing exists.
   */
  onSelectRole?: (role: 'teacher' | 'learner') => void
}

interface RoleCardData {
  role: 'teacher' | 'learner'
  title: string
  blurb: string
  href: string
  accent: 'primary' | 'secondary'
  icon: string
}

const ROLE_CARDS: RoleCardData[] = [
  {
    role: 'teacher',
    title: 'I\u2019m a Teacher',
    blurb: 'Assign assessments, review learner work, and track progress.',
    href: '/teacher/dashboard',
    accent: 'primary',
    icon: '\u{1F468}\u200D\u{1F3EB}',
  },
  {
    role: 'learner',
    title: 'I\u2019m a Learner',
    blurb: 'Complete your assigned work, practice, and grow your streak.',
    href: '/learner/home',
    accent: 'secondary',
    icon: '\u{1F9D1}\u200D\u{1F393}',
  },
]

function LandingPage({ onSelectRole }: LandingPageProps) {
  return (
    <main className="landing">
      <header className="landing__hero">
        <span className="landing__badge">TALAS</span>
        <h1 className="landing__title">
          Teaching &amp; Learning,
          <br />
          <span className="landing__title-accent">assessed with care.</span>
        </h1>
        <p className="landing__subtitle">
          A gentle, adaptive assessment companion for teachers and learners.
          Pick how you&apos;re here today to get started.
        </p>
      </header>

      <section className="landing__roles" aria-label="Choose your role">
        {ROLE_CARDS.map((card) => (
          <a
            key={card.role}
            className={`role-card role-card--${card.accent}`}
            href={card.href}
            onClick={(e) => {
              if (onSelectRole) {
                e.preventDefault()
                onSelectRole(card.role)
              }
            }}
          >
            <span className="role-card__icon" aria-hidden="true">
              {card.icon}
            </span>
            <span className="role-card__title">{card.title}</span>
            <span className="role-card__blurb">{card.blurb}</span>
            <span className="role-card__cta">Continue &rarr;</span>
          </a>
        ))}
      </section>

      <footer className="landing__footer">
        <span className="landing__dot landing__dot--primary" />
        <span className="landing__dot landing__dot--secondary" />
        <span className="landing__dot landing__dot--tertiary" />
      </footer>
    </main>
  )
}

export default LandingPage
