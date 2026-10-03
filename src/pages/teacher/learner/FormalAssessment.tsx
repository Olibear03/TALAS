import { useParams } from 'react-router-dom'
import { learnerProfile } from '../../../features/teacher/dashboard/sectionData'

/** Formal Assessments tab — locked CRLA/DepEd baseline record for a learner. */
function FormalAssessment() {
  const { learnerId } = useParams()
  const profile = learnerProfile(learnerId)
  const formal = profile?.formal ?? null

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">🔒</span>
        <h2 className="font-display text-lg font-bold text-charcoal">Formal Assessments</h2>
        <span className="ml-auto px-2 py-0.5 rounded bg-sprout-50 text-sprout-500 font-sans text-xs font-bold">
          Locked record
        </span>
      </div>

      {formal ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-paper border border-gray-100 rounded-xl p-5 space-y-2">
            <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">Classification</span>
            <p className="font-sans text-sm font-bold text-charcoal">{formal.classification}</p>
            <p className="font-sans text-sm text-gray-600">{formal.readerStage}</p>
            <span className="font-sans text-xs text-gray-400">{formal.period}</span>
          </div>
          <div className="bg-paper border border-gray-100 rounded-xl p-5 space-y-2">
            <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">Date Finalized</span>
            <p className="font-sans text-sm font-bold text-charcoal">{formal.dateFinalized}</p>
            <span className="font-sans text-xs text-gray-400">Assessed by {formal.assessor}</span>
          </div>
          <div className="bg-paper border border-gray-100 rounded-xl p-5 space-y-2">
            <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">Verified Miscues</span>
            <p className="font-sans text-sm font-bold text-charcoal">{formal.miscues}</p>
            <span className="font-sans text-xs text-gray-500">{formal.comprehension}</span>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-sans text-xs text-gray-400">Phonemes:</span>
              {formal.phonemesFlagged.map((p) => (
                <span key={p} className="px-1.5 py-0.5 bg-crla-fr/15 text-crla-fr rounded font-sans text-xs font-bold">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="font-sans text-sm text-gray-400">No formal assessment on record yet.</p>
      )}
    </section>
  )
}

export default FormalAssessment
