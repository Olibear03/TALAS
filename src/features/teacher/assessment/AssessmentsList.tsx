import { useNavigate } from 'react-router-dom'

interface AssessmentRow {
  id: string
  learnerId: string
  learner: string
  type: string
  status: 'Assigned' | 'Submitted' | 'Reviewed'
}

const ASSESSMENTS: AssessmentRow[] = [
  { id: 'A-5501', learnerId: 'JD-1083', learner: 'Juan Dela Cruz', type: 'Oral Fluency', status: 'Submitted' },
  { id: 'A-5502', learnerId: 'AS-2041', learner: 'Amina Santos', type: 'Letter-Sound', status: 'Assigned' },
  { id: 'A-5503', learnerId: 'GR-3012', learner: 'Gabriel Reyes', type: 'Comprehension', status: 'Reviewed' },
]

const STATUS_TONE: Record<AssessmentRow['status'], string> = {
  Assigned: 'bg-surface-container-high text-on-surface',
  Submitted: 'bg-error-container text-on-error-container',
  Reviewed: 'bg-primary-container/20 text-primary',
}

/** List of assigned/submitted assessments with an entry point to assign new ones. */
function AssessmentsList() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
          <p className="text-on-surface-variant">
            Formal assessments assigned across your classes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/teacher/assessments/new/AS-2041')}
          className="h-11 px-5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-semibold transition-colors shrink-0"
        >
          Assign Assessment
        </button>
      </header>

      <div className="flex flex-col gap-2">
        {ASSESSMENTS.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-lowest shadow-sm"
          >
            <span className="flex flex-col min-w-0">
              <span className="font-bold truncate">{a.learner}</span>
              <span className="text-sm text-on-surface-variant">
                {a.type} • {a.id}
              </span>
            </span>
            <span className={`ml-auto px-2.5 py-1 rounded-full text-sm font-bold ${STATUS_TONE[a.status]}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AssessmentsList
