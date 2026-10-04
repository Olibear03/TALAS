import { useEffect, useState } from 'react'
import {
  listReadingAttemptsByLearner,
  listSilentAttemptsByLearner,
  syncNow,
  type ReadingAttempt,
  type SilentAttempt,
} from '../../../data'

/**
 * Loads one learner's oral and silent reading records together. Local IndexedDB
 * is read immediately; cloud sync runs in the background and both collections
 * are then refreshed. Keeping this in one hook avoids duplicate sync calls from
 * separate oral/silent progress widgets.
 */
export function useAssessmentAttempts(learnerId: string | undefined): {
  oralAttempts: ReadingAttempt[]
  silentAttempts: SilentAttempt[]
  loading: boolean
  refresh: () => void
} {
  const [oralAttempts, setOralAttempts] = useState<ReadingAttempt[]>([])
  const [silentAttempts, setSilentAttempts] = useState<SilentAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function readLocal() {
      if (!learnerId) {
        if (!cancelled) {
          setOralAttempts([])
          setSilentAttempts([])
          setLoading(false)
        }
        return
      }

      const [oral, silent] = await Promise.all([
        listReadingAttemptsByLearner(learnerId),
        listSilentAttemptsByLearner(learnerId),
      ])
      if (!cancelled) {
        setOralAttempts(oral)
        setSilentAttempts(silent)
        setLoading(false)
      }
    }

    void readLocal()
    void (async () => {
      try {
        await syncNow()
      } catch {
        /* Offline: the immediate local read remains available. */
      }
      if (!cancelled) await readLocal()
    })()

    return () => {
      cancelled = true
    }
  }, [learnerId, tick])

  return {
    oralAttempts,
    silentAttempts,
    loading,
    refresh: () => setTick((value) => value + 1),
  }
}
