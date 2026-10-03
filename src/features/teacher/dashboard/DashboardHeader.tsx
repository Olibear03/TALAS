/** Greeting + current date header for the teacher dashboard. */
function DashboardHeader() {
  const now = new Date()

  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const dateLabel = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="flex flex-col gap-1">
      <h1 className="font-display text-2xl font-bold text-charcoal">Dashboard</h1>
      <p className="font-sans text-sm text-gray-500">
        {greeting}, Teacher · {dateLabel}
      </p>
    </header>
  )
}

export default DashboardHeader
