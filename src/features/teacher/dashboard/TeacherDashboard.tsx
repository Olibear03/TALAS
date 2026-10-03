import { useState } from 'react'
import DashboardHeader from './DashboardHeader'
import SectionSelector from './SectionSelector'
import QuickStats from './QuickStats'
import PendingActions from './PendingActions'
import ClassDistribution from './ClassDistribution'
import RecentActivity from './RecentActivity'
import LearnerListTable from './LearnerListTable'

/**
 * Teacher Dashboard page (route `/teacher`). Rendered inside <AppLayout>,
 * so it provides page content only. The teacher picks a section and the
 * stats, distribution, and learner table filter to that section.
 */
function TeacherDashboard() {
  const [sectionId, setSectionId] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardHeader />
        <SectionSelector value={sectionId} onChange={setSectionId} />
      </div>

      <QuickStats sectionId={sectionId} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingActions />
        <ClassDistribution sectionId={sectionId} />
      </div>

      <RecentActivity />
      <LearnerListTable sectionId={sectionId} />
    </div>
  )
}

export default TeacherDashboard
