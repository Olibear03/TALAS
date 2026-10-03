/** Greeting + context header for the teacher dashboard (mockup-styled). */
function DashboardHeader() {
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Magandang umaga' : hour < 18 ? 'Magandang hapon' : 'Magandang gabi'

  const dateLabel = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="space-y-2">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sprout-50 text-sprout-500 font-sans text-xs font-semibold tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-sprout-500 animate-pulse" />
        <span>SY 2026–2027 • Ikalawang Markahan</span>
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
        {greeting}, Teacher Maria{' '}
        <span className="inline-block hover:rotate-12 transition-transform cursor-default">
          👋
        </span>
      </h1>
      <p className="font-reading text-sm text-gray-500 max-w-2xl">
        {dateLabel} · Track and support Grade 1–3 early literacy progress across
        Phil-IRI and Marungko approaches with diagnostic confidence.
      </p>
    </header>
  )
}

export default DashboardHeader
