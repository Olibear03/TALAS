import { createBrowserRouter } from 'react-router-dom'
import RoleSelector from '../features/auth/RoleSelector'
import AppLayout from '../features/shared/components/AppLayout'
import LearnerLayout from '../layouts/LearnerLayout'
import TeacherDashboard from '../features/teacher/dashboard/TeacherDashboard'
import LearnersList from '../pages/teacher/LearnersList'
import AssessmentsList from '../pages/teacher/AssessmentsList'
import AssignAssessment from '../pages/teacher/AssignAssessment'
import PendingRecommendations from '../pages/teacher/PendingRecommendations'
import ActivitiesList from '../pages/teacher/ActivitiesList'
import ReviewAssessment from '../pages/teacher/ReviewAssessment'
import Reports from '../pages/teacher/Reports'
import Overview from '../pages/teacher/learner/Overview'
import FormalAssessment from '../pages/teacher/learner/FormalAssessment'
import LearnerRecommendations from '../pages/teacher/learner/Recommendations'
import LearnerActivities from '../pages/teacher/learner/Activities'
import DevelopmentProfile from '../pages/teacher/learner/DevelopmentProfile'

/**
 * Route tree.
 *
 * `/`                                         Role selection (landing)
 * `/teacher` (AppLayout shell)
 *   ├─ (index)                                Teacher Dashboard
 *   ├─ learners                               Learner list
 *   │   └─ :learnerId (LearnerLayout tabs)
 *   │        ├─ (index) Overview
 *   │        ├─ formal-assessment
 *   │        ├─ recommendations
 *   │        ├─ activities
 *   │        └─ development-profile
 *   ├─ assessments
 *   │   └─ new/:learnerId
 *   ├─ recommendations
 *   ├─ activities
 *   │   └─ :activityId/review
 *   └─ reports
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RoleSelector />,
  },
  {
    path: '/teacher',
    element: <AppLayout />,
    children: [
      { index: true, element: <TeacherDashboard /> },
      {
        path: 'learners',
        children: [
          { index: true, element: <LearnersList /> },
          {
            path: ':learnerId',
            element: <LearnerLayout />,
            children: [
              { index: true, element: <Overview /> },
              { path: 'formal-assessment', element: <FormalAssessment /> },
              { path: 'recommendations', element: <LearnerRecommendations /> },
              { path: 'activities', element: <LearnerActivities /> },
              { path: 'development-profile', element: <DevelopmentProfile /> },
            ],
          },
        ],
      },
      {
        path: 'assessments',
        children: [
          { index: true, element: <AssessmentsList /> },
          { path: 'new/:learnerId', element: <AssignAssessment /> },
        ],
      },
      { path: 'recommendations', element: <PendingRecommendations /> },
      {
        path: 'activities',
        children: [
          { index: true, element: <ActivitiesList /> },
          { path: ':activityId/review', element: <ReviewAssessment /> },
        ],
      },
      { path: 'reports', element: <Reports /> },
    ],
  },
])
