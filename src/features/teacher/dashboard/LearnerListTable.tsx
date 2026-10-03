import { useNavigate } from 'react-router-dom'

type CrlaLevel = 'GR' | 'LR' | 'MR' | 'FR' | null

interface LearnerRow {
  id: string
  name: string
  initials: string
  grade: string
  level: CrlaLevel
  lastActive: string
}

const LEARNERS: LearnerRow[] = [
  { id: 'BR-3101', name: 'Bea Ramos', initials: 'BR', grade: 'Grade 3-A', level: 'GR', lastActive: '10m ago' },
  { id: 'AS-2041', name: 'Amina Santos', initials: 'AS', grade: 'Grade 1-B', level: 'FR', lastActive: '1h ago' },
  { id: 'GR-3012', name: 'Gabriel Reyes', initials: 'GR', grade: 'Grade 3-A', level: 'LR', lastActive: '2h ago' },
  { id: 'JD-1083', name: 'Juan Dela Cruz', initials: 'JD', grade: 'Grade 2-A', level: 'MR', lastActive: 'Yesterday' },
  { id: 'SM-1120', name: 'Sofia Manuel', initials: 'SM', grade: 'Grade 1-B', level: null, lastActive: '45m ago' },
]

const LEVEL_META: Record<Exclude<CrlaLevel, null>, { label: string; cls: string }> = {
  GR: { label: 'Grade Ready', cls: 'bg-crla-gr/15 text-crla-gr' },
  LR: { label: 'Light Refresher', cls: 'bg-crla-lr/20 text-charcoal' },
  MR: { label: 'Moderate Refresher', cls: 'bg-crla-mr/15 text-crla-mr' },
  FR: { label: 'Full Refresher', cls: 'bg-crla-fr/15 text-crla-fr' },
}

function LevelBadge({ level }: { level: CrlaLevel }) {
  if (!level) {
    return (
      <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 font-sans text-xs font-semibold">
        Not assessed
      </span>
    )
  }
  const meta = LEVEL_META[level]
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full font-sans text-xs font-bold ${meta.cls}`}>
      {level} · {meta.label}
    </span>
  )
}

function LearnerListTable() {
  const navigate = useNavigate()

  return (
    <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <h2 className="font-display text-lg font-bold text-charcoal">Learners</h2>
        <button
          type="button"
          onClick={() => navigate('/teacher/learners')}
          className="font-sans text-sm font-semibold text-sprout-500 hover:underline"
        >
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50/60">
              <th className="px-5 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Learner</th>
              <th className="px-5 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</th>
              <th className="px-5 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Reading Level</th>
              <th className="px-5 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {LEARNERS.map((l) => (
              <tr
                key={l.id}
                onClick={() => navigate(`/teacher/learners/${l.id}`)}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-sprout-50 text-sprout-500 flex items-center justify-center font-sans text-xs font-bold">
                      {l.initials}
                    </span>
                    <span className="font-sans text-sm font-semibold text-charcoal">{l.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 font-sans text-sm text-gray-600">{l.grade}</td>
                <td className="px-5 py-3"><LevelBadge level={l.level} /></td>
                <td className="px-5 py-3 font-sans text-sm text-gray-400">{l.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default LearnerListTable
