import LandingPage from '../pages/LandingPage'

// Temporary mount so the landing page is visible now. Task 7 replaces this
// with the RouterProvider + providers wiring; the landing page becomes the
// `/` route and its onSelectRole will navigate via the router.
function App() {
  return <LandingPage />
}

export default App
