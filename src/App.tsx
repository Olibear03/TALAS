import { useState } from 'react'
import LearnerAccess from './screens/learner/LearnerAccess'
import LearnerDashboard from './screens/learner/LearnerDashboard'
import OralAssessment from './screens/learner/OralAssessment'
import OralCompletion from './screens/learner/OralCompletion'
import SilentAssessment from './screens/learner/SilentAssessment'
import FormalAssessmentCompletion from './screens/learner/FormalAssessmentCompletion'

type Screen =
  | 'learner-access'
  | 'dashboard'
  | 'oral-assessment'
  | 'oral-completion'
  | 'silent-assessment'
  | 'formal-completion'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('learner-access')
  const [learnerName, setLearnerName] = useState<string>('')

  const handleAccess = (name: string) => {
    setLearnerName(name)
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
          onGoToProfile={() => alert('Profile — malapit na!')}
        />
      )
    case 'oral-assessment':
      return (
        <OralAssessment
          learnerName={learnerName}
          onBack={() => setCurrentScreen('dashboard')}
          onSubmit={() => setCurrentScreen('oral-completion')}
        />
      )
    case 'oral-completion':
      return <OralCompletion onContinue={() => setCurrentScreen('silent-assessment')} />
    case 'silent-assessment':
      return (
        <SilentAssessment
          learnerName={learnerName}
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
    default:
      return null
  }
}
