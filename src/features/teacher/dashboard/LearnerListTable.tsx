import { useNavigate } from 'react-router-dom'
import { learnersForSection, type CrlaLevel } from './sectionData'

interface LearnerListTableProps {
  sectionId?: string
}

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

function LearnerListTable({ sectionId = 'all' }: LearnerListTableProps) {
  const navigate = useNavigate()
  const learners = learnersForSection(sectionId)

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg font-bold text-charcoal">Learners</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sprout-50 text-sprout-500 font-sans text-xs font-semibold">
            {learners.length} shown
          </span>
        </div>
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
            <tr className="border-y border-gray-100 bg-paper">
              <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Learner</th>
              <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</th>
              <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Reading Level</th>
              <th className="px-6 py-3 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {learners.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center font-sans text-sm text-gray-400">
                  No learners in this section.
                </td>
              </tr>
            ) : (
              learners.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => navigate(`/teacher/learners/${l.id}`)}
                  className="border-b border-gray-50 last:border-0 hover:bg-paper cursor-pointer"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-sprout-50 text-sprout-500 flex items-center justify-center font-sans text-xs font-bold">
                        {l.initials}
                      </span>
                      <span className="font-sans text-sm font-semibold text-charcoal">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 font-sans text-sm text-gray-600">{l.grade}</td>
                  <td className="px-6 py-3"><LevelBadge level={l.level} /></td>
                  <td className="px-6 py-3 font-sans text-sm text-gray-400">{l.lastActive}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default LearnerListTable
