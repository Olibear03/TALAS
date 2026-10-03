import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * Recent learner submissions. Starts empty — real submissions will populate
 * this once learners complete assessments and the teacher dashboard is wired to
 * live data.
 */
function RecentActivity() {
  const navigate = useNavigate()

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-charcoal">Recent Submissions</h2>
      </div>

      <div className="py-8 text-center">
        <p className="font-sans text-sm text-gray-500">No submissions yet.</p>
        <p className="font-sans text-xs text-gray-400 mt-1">
          Learner submissions will appear here once they complete their work.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/teacher/activities')}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-paper hover:bg-gray-50 border border-gray-100 text-charcoal font-sans text-sm font-semibold transition-colors group"
      >
        <span>View all assessment logs</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </button>
    </section>
  )
}

export default RecentActivity
