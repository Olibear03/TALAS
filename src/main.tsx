import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { seedDatabase, startAutoSync } from './data'

// Seed the local IndexedDB once (no-op if data already exists), then kick off
// background sync: an initial sync if online + auto-sync on reconnect. The UI
// renders immediately regardless — IndexedDB is the source of truth.
seedDatabase()
  .then((seeded) => {
    if (seeded) console.info('[TALAS] Seeded initial data (Maria, Amina, Math Basics Quiz).')
    startAutoSync()
  })
  .catch((err) => console.error('[TALAS] Failed to seed database:', err))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
