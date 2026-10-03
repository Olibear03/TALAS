import { useState } from 'react'
import LearnerAccess from './screens/learner/LearnerAccess'
import LearnerDashboard from './screens/learner/LearnerDashboard'
import OralAssessment from './screens/learner/OralAssessment'
import OralCompletion from './screens/learner/OralCompletion'
import SilentAssessment from './screens/learner/SilentAssessment'
import FormalAssessmentCompletion from './screens/learner/FormalAssessmentCompletion'
import PracticeActivity from './screens/learner/practice/PracticeActivity'

type Screen =
  | 'learner-access'
  | 'dashboard'
  | 'oral-assessment'
  | 'oral-completion'
  | 'silent-assessment'
  | 'formal-completion'
  | 'practice-activity'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('learner-access')
  const [learnerName, setLearnerName] = useState<string>('')

  const handleAccess = (name: string) => {
    setLearnerName(name)
    setCurrentScreen('dashboard')
  }

  const handleActivityComplete = (_scorePercent: number) => {
    // Return to dashboard after finishing an activity (practice-lobby removed; FEAT-002 adds encouragement screen)
    setCurrentScreen('dashboard')
  }

  const handleActivityBack = () => {
    // Back arrow inside an activity goes to dashboard (practice-lobby removed; FEAT-002 restores flow)
    setCurrentScreen('dashboard')
  }

  switch (currentScreen) {
    case 'learner-access':
      return <LearnerAccess onAccess={handleAccess} />

    case 'dashboard':
      return (
        <LearnerDashboard
          learnerName={learnerName}
          onStartAssessment={() => setCurrentScreen('oral-assessment')}
          onGoToPractice={() => setCurrentScreen('practice-activity')}
          onGoToProfile={() => alert('Profile — malapit na!')}
        />
      )

    case 'oral-assessment':
      return (
        <OralAssessment
          onBack={() => setCurrentScreen('dashboard')}
          onSubmit={() => setCurrentScreen('oral-completion')}
        />
      )

    case 'oral-completion':
      return <OralCompletion onContinue={() => setCurrentScreen('silent-assessment')} />

    case 'silent-assessment':
      return (
        <SilentAssessment
          onComplete={() => setCurrentScreen('formal-completion')}
        />
      )

    case 'formal-completion':
      return (
        <FormalAssessmentCompletion
          learnerName={learnerName}
          onDone={() => setCurrentScreen('dashboard')}
        />
      )

    case 'practice-activity':
      return (
        <PracticeActivity
          activityId={'practice-001'}
          onComplete={handleActivityComplete}
          onBack={handleActivityBack}
        />
      )

    default:
      return null
  }
}
