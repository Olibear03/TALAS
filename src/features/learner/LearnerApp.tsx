import { useEffect, useState } from 'react'
import LearnerAuth from '../auth/LearnerAuth'
import LearnerDashboard from '../../screens/learner/LearnerDashboard'
import OralAssessment from '../../screens/learner/OralAssessment'
import OralCompletion from '../../screens/learner/OralCompletion'
import SilentAssessment from '../../screens/learner/SilentAssessment'
import FormalAssessmentCompletion from '../../screens/learner/FormalAssessmentCompletion'
import PracticeActivity from '../../screens/learner/practice/PracticeActivity'
import PracticeCompletion from '../../screens/learner/PracticeCompletion'
import LearnerProfile from '../../screens/learner/LearnerProfile'
import {
  getNextPracticeActivity,
  updatePracticeLevel,
} from '../../data/practiceData'
import type {
  PracticeProfile,
  PracticeActivityDef,
} from '../../data/practiceData'
import {
  setLearnerInactive,
  type LearnerRecord,
} from '../teacher/dashboard/sectionData'
import type { OralResult } from '../../screens/learner/OralAssessment'
import { listReadingAttemptsByLearner, syncNow } from '../../data'
import {
  mixedReadingForLevel,
  readingLevelFromAccuracy,
  type BankActivity,
} from '../../data/contentBank'

/**
 * Learner experience, mounted at `/learner` from Oliver's router. This hosts
 * the real reading-assessment flow (speech recognition, scoring, timestamps,
 * S3 recording upload, IndexedDB persistence). The first app page is still
 * Oliver's RoleSelector at `/`; picking "I'm a Learner" routes here.
 *
 * Internally this is a simple screen switch (not nested routes), which keeps
 * the self-contained assessment flow intact as it was built and tested.
 */
type Screen =
  | 'dashboard'
  | 'oral-assessment'
  | 'oral-completion'
  | 'silent-assessment'
  | 'formal-completion'
  | 'practice-activity'
  | 'practice-completion'
  | 'profile'

export default function LearnerApp() {
  // The authenticated learner (null until a valid code is entered).
  const [learner, setLearner] = useState<LearnerRecord | null>(null)
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard')
  const learnerName = learner?.name ?? 'Mag-aaral'
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
  const [, setOralResult] = useState<OralResult | null>(null)
  const [oralResultForView, setOralResultForView] = useState<OralResult | null>(
    null,
  )
  // The next reading is selected automatically from the learner's best synced
  // oral-reading accuracy. No teacher assignment is required.
  const [automaticActivity, setAutomaticActivity] = useState<BankActivity | null>(null)
  const [bestAccuracy, setBestAccuracy] = useState<number | null>(null)

  // On login, sync and inspect the learner's prior readings. No prior attempt
  // means they take the default baseline passage first. Otherwise, TALAS maps
  // their best accuracy to Content Bank Level 1–5 automatically.
  useEffect(() => {
    let cancelled = false
    void (async () => {
      if (!learner) {
        if (!cancelled) {
          setAutomaticActivity(null)
          setBestAccuracy(null)
        }
        return
      }
      try {
        await syncNow()
      } catch {
        /* offline — use locally stored attempts */
      }
      const attempts = await listReadingAttemptsByLearner(learner.id)
      const best = attempts.length > 0
        ? Math.max(...attempts.map((a) => a.accuracy))
        : null
      if (cancelled) return

      setBestAccuracy(best)
      if (best == null) {
        setAutomaticActivity(null)
        return
      }

      const level = readingLevelFromAccuracy(best)
      setAutomaticActivity(mixedReadingForLevel(level) ?? null)
      setPracticeProfile((profile) => ({ ...profile, currentLevel: level }))
    })()
    return () => {
      cancelled = true
    }
  }, [learner])

  const automaticPassageText = automaticActivity?.passage.join('\n\n')
  const automaticPassageId = automaticActivity?.id

  const handleStartPractice = () => {
    const act: PracticeActivityDef = getNextPracticeActivity(practiceProfile)
    setActiveActivityId(act.id)
    setLastActivityTitle(act.title)
    setCurrentScreen('practice-activity')
  }

  const handleActivityComplete = (scorePercent: number) => {
    const updated = updatePracticeLevel(
      practiceProfile,
      scorePercent,
      activeActivityId,
    )
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

  /** Sign the learner out: clear their active status and return to the gate. */
  const handleExit = () => {
    if (learner) setLearnerInactive(learner.id)
    setLearner(null)
    setCurrentScreen('dashboard')
  }

  // Code gate: no entry without a valid per-student code.
  if (!learner) {
    return <LearnerAuth onSuccess={setLearner} />
  }

  switch (currentScreen) {
    case 'dashboard':
      return (
        <LearnerDashboard
          learnerName={learnerName}
          readingTitle={automaticActivity?.title}
          automaticLevel={automaticActivity?.level}
          onStartAssessment={() => setCurrentScreen('oral-assessment')}
          onStartPractice={handleStartPractice}
          onGoToProfile={() => setCurrentScreen('profile')}
        />
      )
    case 'oral-assessment':
      return (
        <OralAssessment
          learnerId={learner.id}
          passageText={automaticPassageText}
          passageId={automaticPassageId}
          onBack={() => setCurrentScreen('dashboard')}
          onSubmit={(result) => {
            setOralResult(result)
            setOralResultForView(result)

            // Recalculate immediately after every reading. The best result is
            // retained as the formal CRLA basis, and its accuracy determines
            // which Content Bank level the learner reads next.
            const nextBest = Math.max(bestAccuracy ?? 0, result.accuracy)
            const nextLevel = readingLevelFromAccuracy(nextBest)
            setBestAccuracy(nextBest)
            setAutomaticActivity(mixedReadingForLevel(nextLevel) ?? null)
            setPracticeProfile((profile) => ({ ...profile, currentLevel: nextLevel }))
            setCurrentScreen('oral-completion')
          }}
        />
      )
    case 'oral-completion':
      return (
        <OralCompletion
          result={oralResultForView}
          onContinue={() => setCurrentScreen('silent-assessment')}
        />
      )
    case 'silent-assessment':
      return (
        <SilentAssessment
          learnerId={learner.id}
          onComplete={() => setCurrentScreen('formal-completion')}
        />
      )
    case 'formal-completion':
      return (
        <FormalAssessmentCompletion
          learnerName={learnerName}
          onDone={handleExit}
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
case 'profile':
      return (
        <LearnerProfile
          learnerName={learnerName}
          practiceProfile={practiceProfile}
          onBack={() => setCurrentScreen('dashboard')}
          onExit={handleExit}
        />
      )
        default:
      return null
  }
}
