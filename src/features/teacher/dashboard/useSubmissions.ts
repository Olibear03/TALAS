import { useEffect, useState } from 'react'
import { getAll, syncNow, type ReadingAttempt } from '../../../data'

export interface SubmissionsIndex {
  /** attempts grouped by learnerId */
  byLearner: Record<string, ReadingAttempt[]>
  /** learner ids that have at least one submission */
  submittedIds: Set<string>
  /** total submission count across all learners */
  total: number
}

const EMPTY: SubmissionsIndex = {
  byLearner: {},
  submittedIds: new Set(),
  total: 0,
}

/**
 * Loads every reading attempt from the data layer and indexes it by learner,
 * so the teacher dashboard can show real submission counts / "needs review".
 * Syncs first (best-effort) so attempts submitted on another device are pulled
 * in. Re-reads on mount; call `refresh()` to re-pull.
 */
export function useSubmissions(): SubmissionsIndex & { refresh: () => void } {
  const [index, setIndex] = useState<SubmissionsIndex>(EMPTY)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function readLocal() {
      const all = await getAll('readingAttempts')
      if (cancelled) return
      const live = all.filter((a) => a.deleted !== true)
      const byLearner: Record<string, ReadingAttempt[]> = {}
      for (const a of live) {
        ;(byLearner[a.learnerId] ??= []).push(a)
      }
      setIndex({
        byLearner,
        submittedIds: new Set(Object.keys(byLearner)),
        total: live.length,
      })
    }

    // Read local immediately, then sync in the background and re-read.
    void readLocal()
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
  }, [tick])

  return { ...index, refresh: () => setTick((t) => t + 1) }
}
