import { useState } from 'react'
import LearnerEntry from './screens/LearnerEntry'
import ReadingLobby from './screens/ReadingLobby'
import SilentPassage from './screens/SilentPassage'
import ComprehensionQuiz from './screens/ComprehensionQuiz'
import CompletionScreen from './screens/CompletionScreen'
import { mockQuiz } from './data/mockData'

type Screen = 'entry' | 'lobby' | 'passage' | 'quiz' | 'completion'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('entry')
  const [learnerName, setLearnerName] = useState<string>('')
  const [score, setScore] = useState<number>(0)

  const handleStart = (name: string) => {
    setLearnerName(name)
    setCurrentScreen('lobby')
  }

  const handleStartReading = () => setCurrentScreen('passage')

  const handleDoneReading = () => setCurrentScreen('quiz')

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore)
    setCurrentScreen('completion')
  }

  const handleDone = () => {
    setLearnerName('')
    setScore(0)
    setCurrentScreen('entry')
  }

  switch (currentScreen) {
    case 'entry':
      return <LearnerEntry onStart={handleStart} />
    case 'lobby':
      return <ReadingLobby learnerName={learnerName} onStartReading={handleStartReading} />
    case 'passage':
      return <SilentPassage onDoneReading={handleDoneReading} />
    case 'quiz':
      return <ComprehensionQuiz onComplete={handleQuizComplete} />
    case 'completion':
      return (
        <CompletionScreen
          learnerName={learnerName}
          score={score}
          totalQuestions={mockQuiz.length}
          onDone={handleDone}
        />
      )
  }
}
