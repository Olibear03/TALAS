/**
 * Mock section + learner data for the teacher dashboard.
 *
 * This is the single source of truth the dashboard filters by section.
 * No backend: swap the arrays / add a fetch later without changing the
 * components that read from here.
 */

export type CrlaLevel = 'GR' | 'LR' | 'MR' | 'FR' | null

export interface LearnerRecord {
  id: string
  name: string
  initials: string
  grade: string
  /** Section this learner belongs to. */
  sectionId: string
  level: CrlaLevel
  lastActive: string
  /** Had activity within the last 24h. */
  activeToday: boolean
}

export interface Section {
  id: string
  label: string
}

/** `all` is a virtual section meaning "every learner". */
export const SECTIONS: Section[] = [
  { id: 'all', label: 'All Sections' },
  { id: 'sampaguita', label: 'Grade 1 · Sampaguita' },
  { id: 'rosal', label: 'Grade 2 · Rosal' },
  { id: 'mabini', label: 'Grade 3 · Mabini' },
]

export const LEARNERS: LearnerRecord[] = [
  // Grade 3 · Mabini
  { id: 'BR-3101', name: 'Bea Ramos', initials: 'BR', grade: 'Grade 3-A', sectionId: 'mabini', level: 'GR', lastActive: '10m ago', activeToday: true },
  { id: 'GR-3012', name: 'Gabriel Reyes', initials: 'GR', grade: 'Grade 3-A', sectionId: 'mabini', level: 'LR', lastActive: '2h ago', activeToday: true },
  { id: 'LT-3044', name: 'Liza Tan', initials: 'LT', grade: 'Grade 3-A', sectionId: 'mabini', level: 'GR', lastActive: 'Yesterday', activeToday: false },

  // Grade 2 · Rosal
  { id: 'JD-1083', name: 'Juan Dela Cruz', initials: 'JD', grade: 'Grade 2-A', sectionId: 'rosal', level: 'MR', lastActive: 'Yesterday', activeToday: false },
  { id: 'CG-2210', name: 'Carlo Garcia', initials: 'CG', grade: 'Grade 2-A', sectionId: 'rosal', level: 'LR', lastActive: '25m ago', activeToday: true },
  { id: 'MP-2255', name: 'Mika Perez', initials: 'MP', grade: 'Grade 2-A', sectionId: 'rosal', level: 'MR', lastActive: '3h ago', activeToday: true },

  // Grade 1 · Sampaguita
  { id: 'AS-2041', name: 'Amina Santos', initials: 'AS', grade: 'Grade 1-B', sectionId: 'sampaguita', level: 'FR', lastActive: '1h ago', activeToday: true },
  { id: 'SM-1120', name: 'Sofia Manuel', initials: 'SM', grade: 'Grade 1-B', sectionId: 'sampaguita', level: null, lastActive: '45m ago', activeToday: true },
  { id: 'RB-1130', name: 'Rafael Bautista', initials: 'RB', grade: 'Grade 1-B', sectionId: 'sampaguita', level: 'FR', lastActive: 'Yesterday', activeToday: false },
]

/** Returns the learners for a section id, or all learners for `all`. */
export function learnersForSection(sectionId: string): LearnerRecord[] {
  if (sectionId === 'all') return LEARNERS
  return LEARNERS.filter((l) => l.sectionId === sectionId)
}

export function sectionLabel(sectionId: string): string {
  return SECTIONS.find((s) => s.id === sectionId)?.label ?? 'All Sections'
}
