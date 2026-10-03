import { createBrowserRouter } from 'react-router-dom'
import RoleSelector from '../features/auth/RoleSelector'
import LearnerApp from '../features/learner/LearnerApp'
import TeacherGate from '../features/auth/TeacherGate'
import LearnerLayout from '../layouts/LearnerLayout'
import TeacherDashboard from '../features/teacher/dashboard/TeacherDashboard'
import LearnersList from '../features/teacher/learners/LearnersList'
import AssessmentsList from '../features/teacher/assessment/AssessmentsList'
import AssignAssessment from '../features/teacher/assessment/AssignAssessment'
import ActivitiesList from '../features/teacher/activity/ActivitiesList'
import ReviewAssessment from '../features/teacher/activity/ReviewAssessment'
import Reports from '../features/teacher/reports/Reports'
import Overview from '../features/teacher/profile/Overview'
import FormalAssessment from '../features/teacher/profile/FormalAssessment'
import LearnerRecommendations from '../features/teacher/profile/Recommendations'
import LearnerActivities from '../features/teacher/profile/Activities'
import DevelopmentProfile from '../features/teacher/profile/DevelopmentProfile'

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
  // Learner experience — the real reading-assessment flow (speech recognition,
  // scoring, timestamps, S3 recording, IndexedDB). RoleSelector's "I'm a
  // Learner" card routes to /learner/home.
  {
    path: '/learner',
    element: <LearnerApp />,
  },
  {
    path: '/learner/home',
    element: <LearnerApp />,
  },
  {
    path: '/teacher',
    element: <TeacherGate />,
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
