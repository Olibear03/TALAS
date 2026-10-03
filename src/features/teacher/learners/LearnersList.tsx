import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crlaLabel, learnersForSection } from '../dashboard/sectionData'
import SectionSelector from '../dashboard/SectionSelector'

/** Teacher learner directory. Rows link to the learner profile. */
function LearnersList() {
  const navigate = useNavigate()
  const [sectionId, setSectionId] = useState('all')

  const learners = learnersForSection(sectionId)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-charcoal tracking-tight">Learners</h1>
          <p className="font-sans text-sm text-gray-500">
            All learners across your Grade 1–3 classes.
          </p>
        </div>
        <SectionSelector value={sectionId} onChange={setSectionId} />
      </header>

      {learners.length === 0 ? (
        <p className="font-sans text-sm text-gray-500 py-8 text-center">
          No learners in this section yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {learners.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => navigate(`/teacher/learners/${l.id}`)}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-left hover:bg-paper hover:shadow-md transition-all"
            >
              <span className="w-11 h-11 rounded-xl bg-sprout-50 text-sprout-500 flex items-center justify-center font-sans font-bold shrink-0">
                {l.initials}
              </span>
              <span className="flex flex-col min-w-0">
                <span className="font-sans font-semibold text-charcoal truncate">{l.name}</span>
                <span className="font-sans text-sm text-gray-500">
                  {l.grade} • {crlaLabel(l.level)}
                </span>
              </span>
              <span className="ml-auto font-sans text-sm text-gray-400 shrink-0">{l.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LearnersList
