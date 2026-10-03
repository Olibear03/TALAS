/** Aggregate counts shown in the dashboard quick-stats row. */
export interface DashboardStats {
  totalLearners: number
  assessedCount: number
  needSupportCount: number
  activeTodayCount: number
}

/**
 * Mock data source for dashboard stats. Swap the return for a real data
 * fetch (query/API) later without touching the consuming components.
 */
export function useDashboardStats(): DashboardStats {
  return {
    totalLearners: 28,
    assessedCount: 20,
    needSupportCount: 8,
    activeTodayCount: 12,
  }
}
