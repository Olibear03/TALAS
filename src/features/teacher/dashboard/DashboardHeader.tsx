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
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
        {greeting}, Teacher Maria{' '}
        <span className="inline-block hover:rotate-12 transition-transform cursor-default">
          👋
        </span>
      </h1>
      <p className="font-reading text-sm text-gray-500 max-w-2xl">
        {dateLabel}
      </p>
    </header>
  )
}

export default DashboardHeader
