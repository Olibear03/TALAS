import { useNavigate } from 'react-router-dom'
import LandingPage from './LandingPage'

/**
 * Router-aware wrapper around the presentational LandingPage. Keeps
 * LandingPage itself free of router dependencies so it stays easy to test.
 */
function LandingRoute() {
  const navigate = useNavigate()

  return (
    <LandingPage
      onSelectRole={(role) => {
        navigate(role === 'teacher' ? '/teacher/dashboard' : '/learner/home')
      }}
    />
  )
}

export default LandingRoute
