import { learnersForSection } from './sectionData'

/** Aggregate counts shown in the dashboard quick-stats row. */
export interface DashboardStats {
  totalLearners: number
  assessedCount: number
  needSupportCount: number
  activeTodayCount: number
  needsReviewCount: number
}

/**
 * Derives dashboard stats from the mock learner data for the given section
 * (`all` = every learner). Swap `learnersForSection` for a real data fetch
 * later without touching the consuming components.
 */
export function useDashboardStats(sectionId: string = 'all'): DashboardStats {
  const learners = learnersForSection(sectionId)

  const assessedCount = learners.filter((l) => l.level !== null).length
  const needSupportCount = learners.filter(
    (l) => l.level === 'MR' || l.level === 'FR',
  ).length
  const activeTodayCount = learners.filter((l) => l.activeToday).length
  const needsReviewCount = learners.filter((l) => l.needsReview).length

  return {
    totalLearners: learners.length,
    assessedCount,
    needSupportCount,
    activeTodayCount,
    needsReviewCount,
  }
}
