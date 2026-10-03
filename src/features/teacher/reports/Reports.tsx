/** Teacher reports landing. Aggregated class-level reading progress reports. */
function Reports() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-on-surface-variant">
          Class-level progress and diagnostic summaries.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Completion Rate', value: '75%', sub: '18 / 24 assessments' },
          { label: 'Pending Reviews', value: '6', sub: '4 Oral • 2 Letter-Sound' },
          { label: 'Class Reading Streak', value: '12 days', sub: 'Grades 1–3' },
        ].map((c) => (
          <article
            key={c.label}
            className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1"
          >
            <span className="text-sm text-on-surface-variant uppercase tracking-wide">
              {c.label}
            </span>
            <span className="text-2xl font-bold">{c.value}</span>
            <span className="text-sm text-on-surface-variant">{c.sub}</span>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Reports
