import DashboardHeader from './DashboardHeader'
import QuickStats from './QuickStats'
import PendingActions from './PendingActions'
import ClassDistribution from './ClassDistribution'
import RecentActivity from './RecentActivity'
import LearnerListTable from './LearnerListTable'

/**
 * Teacher Dashboard page (route `/teacher`). Rendered inside <AppLayout>,
 * so it provides page content only. Sections stack vertically; the middle
 * band splits into two columns on larger screens.
 */
function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingActions />
        <ClassDistribution />
      </div>

      <RecentActivity />
      <LearnerListTable />
    </div>
  )
}

export default TeacherDashboard
