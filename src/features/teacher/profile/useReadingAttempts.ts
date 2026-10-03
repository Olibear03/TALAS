import { useEffect, useState } from 'react'
import {
  listReadingAttemptsByLearner,
  getAll,
  syncNow,
  getRecordingUrl,
  isRecordingStorageConfigured,
  type ReadingAttempt,
} from '../../../data'

interface DebugInfo {
  totalInDb: number
  allIds: string[]
}

/**
 * Loads a learner's reading attempts from the local data layer (IndexedDB) for
 * the teacher review. Triggers a sync first so attempts a learner submitted on
 * another device are pulled in before we read. Re-reads on mount and whenever
 * the learnerId changes.
 */
export function useReadingAttempts(learnerId: string | undefined): {
  attempts: ReadingAttempt[]
  loading: boolean
  refresh: () => void
  debug: DebugInfo
} {
  const [attempts, setAttempts] = useState<ReadingAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [debug, setDebug] = useState<DebugInfo>({ totalInDb: 0, allIds: [] })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function readLocal() {
      if (!learnerId) {
        if (!cancelled) {
          setAttempts([])
          setLoading(false)
        }
        return
      }
      const list = await listReadingAttemptsByLearner(learnerId)
      // Debug: what's actually in the store, regardless of id match.
      const everything = await getAll('readingAttempts')
      const live = everything.filter((a) => a.deleted !== true)
      if (!cancelled) {
        setAttempts(list)
        setDebug({
          totalInDb: live.length,
          allIds: [...new Set(live.map((a) => a.learnerId))],
        })
        setLoading(false)
      }
    }

    // 1) Read whatever is already local IMMEDIATELY (never blocks on network).
    void readLocal()

    // 2) Sync in the background, then re-read. If sync hangs or fails, the
    //    local read above has already resolved the loading state.
    void (async () => {
      try {
        await syncNow()
      } catch {
        /* offline / no endpoint — local data already shown */
      }
      if (!cancelled) await readLocal()
    })()

    return () => {
      cancelled = true
    }
  }, [learnerId, tick])

  return { attempts, loading, refresh: () => setTick((t) => t + 1), debug }
}

/**
 * Resolves a stored S3 recording key to a short-lived, playable URL. Returns
 * null when there's no key or storage isn't configured.
 */
export async function resolveRecordingUrl(
  audioKey: string | undefined,
): Promise<string | null> {
  if (!audioKey || !isRecordingStorageConfigured()) return null
  try {
    return await getRecordingUrl(audioKey)
  } catch {
    return null
  }
}
