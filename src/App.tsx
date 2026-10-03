import { useState } from 'react'
import LearnerAccess from './screens/learner/LearnerAccess'
import LearnerDashboard from './screens/learner/LearnerDashboard'
import OralAssessment from './screens/learner/OralAssessment'
import OralCompletion from './screens/learner/OralCompletion'
import SilentAssessment from './screens/learner/SilentAssessment'
import FormalAssessmentCompletion from './screens/learner/FormalAssessmentCompletion'
import PracticeActivity from './screens/learner/practice/PracticeActivity'
import PracticeCompletion from './screens/learner/PracticeCompletion'
import { getNextPracticeActivity, updatePracticeLevel } from './data/practiceData'
import type { PracticeProfile, PracticeActivityDef } from './data/practiceData'
import type { OralResult } from './screens/learner/OralAssessment'

type Screen =
  | 'learner-access'
  | 'dashboard'
  | 'oral-assessment'
  | 'oral-completion'
  | 'silent-assessment'
  | 'formal-completion'
  | 'practice-activity'
  | 'practice-completion'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('learner-access')
  const [learnerName, setLearnerName] = useState<string>('')
  const [practiceProfile, setPracticeProfile] = useState<PracticeProfile>({
    currentLevel: 2,
    recentScores: [],
    consecutiveHighScores: 0,
    consecutiveLowScores: 0,
    completedActivityIds: [],
  })
  const [activeActivityId, setActiveActivityId] = useState<string>('')
  const [lastActivityTitle, setLastActivityTitle] = useState<string>('')
  const [lastScorePercent, setLastScorePercent] = useState<number>(0)
  const [oralResult, setOralResult] = useState<OralResult | null>(null)

  const handleAccess = (name: string) => {
    setLearnerName(name)
    setCurrentScreen('dashboard')
  }

  const handleStartPractice = () => {
    const act: PracticeActivityDef = getNextPracticeActivity(practiceProfile)
    setActiveActivityId(act.id)
    setLastActivityTitle(act.title)
    setCurrentScreen('practice-activity')
  }

  const handleActivityComplete = (scorePercent: number) => {
    const updated = updatePracticeLevel(practiceProfile, scorePercent, activeActivityId)
    setPracticeProfile(updated)
    setLastScorePercent(scorePercent)
    setCurrentScreen('practice-completion')
  }

  const handleKeepPracticing = () => {
    const act: PracticeActivityDef = getNextPracticeActivity(practiceProfile)
    setActiveActivityId(act.id)
    setLastActivityTitle(act.title)
    setCurrentScreen('practice-activity')
  }

  switch (currentScreen) {
    case 'learner-access':
      return <LearnerAccess onAccess={handleAccess} />
    case 'dashboard':
      return (
        <LearnerDashboard
          learnerName={learnerName}
          onStartAssessment={() => setCurrentScreen('oral-assessment')}
          onStartPractice={handleStartPractice}
          onGoToProfile={() => alert('Profile — malapit na!')}
        />
      )
    case 'oral-assessment':
      return (
        <OralAssessment
          onBack={() => setCurrentScreen('dashboard')}
          onSubmit={(result) => {
            setOralResult(result)
            setCurrentScreen('oral-completion')
          }}
        />
      )
    case 'oral-completion':
      return (
        <OralCompletion
          result={oralResult}
          onContinue={() => setCurrentScreen('silent-assessment')}
        />
      )
    case 'silent-assessment':
      return (
        <SilentAssessment onComplete={() => setCurrentScreen('formal-completion')} />
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
          activityId={activeActivityId}
          onComplete={handleActivityComplete}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )
    case 'practice-completion':
      return (
        <PracticeCompletion
          learnerName={learnerName}
          activityTitle={lastActivityTitle}
          scorePercent={lastScorePercent}
          onKeepPracticing={handleKeepPracticing}
          onBackToDashboard={() => setCurrentScreen('dashboard')}
        />
      )
    default:
      return null
  }
}
