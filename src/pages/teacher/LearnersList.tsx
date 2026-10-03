import { useNavigate } from 'react-router-dom'

interface LearnerRow {
  id: string
  initials: string
  name: string
  cohort: string
  status: string
}

const LEARNERS: LearnerRow[] = [
  { id: 'JD-1083', initials: 'JD', name: 'Juan Dela Cruz', cohort: 'Grade 2-A', status: 'Full Refresher — Oral' },
  { id: 'AS-2041', initials: 'AS', name: 'Amina Santos', cohort: 'Grade 1-B', status: 'Letter Sounds — Marungko' },
  { id: 'GR-3012', initials: 'GR', name: 'Gabriel Reyes', cohort: 'Grade 3-A', status: 'Comprehension Support' },
]

/** Teacher learner directory. Rows link to the nested learner profile. */
function LearnersList() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Learners</h1>
        <p className="text-on-surface-variant">
          All learners across your Grade 1–3 classes.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        {LEARNERS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => navigate(`/teacher/learners/${l.id}`)}
            className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-lowest shadow-sm text-left hover:bg-surface-container-low transition-colors"
          >
            <span className="w-11 h-11 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold shrink-0">
              {l.initials}
            </span>
            <span className="flex flex-col min-w-0">
              <span className="font-bold truncate">{l.name}</span>
              <span className="text-sm text-on-surface-variant">
                {l.cohort} • {l.status}
              </span>
            </span>
            <span className="ml-auto text-sm text-on-surface-variant shrink-0">{l.id}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LearnersList
