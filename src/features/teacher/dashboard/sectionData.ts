/**
 * Mock section + learner data for the teacher dashboard and learner profile.
 *
 * This is the single source of truth. No backend: swap the arrays / add a
 * fetch later without changing the components that read from here.
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

/* ------------------------------------------------------------------ */
/* Learner profile detail (mock)                                       */
/* ------------------------------------------------------------------ */

const CRLA_LABEL: Record<Exclude<CrlaLevel, null>, string> = {
  GR: 'Grade Ready',
  LR: 'Light Refresher',
  MR: 'Moderate Refresher',
  FR: 'Full Refresher',
}

export function crlaLabel(level: CrlaLevel): string {
  return level ? CRLA_LABEL[level] : 'Not yet assessed'
}

export interface FormalAssessmentRecord {
  period: string
  classification: string
  readerStage: string
  dateFinalized: string
  assessor: string
  miscues: string
  comprehension: string
  phonemesFlagged: string[]
}

export interface InterventionRecord {
  title: string
  tier: string
  directive: string
  description: string
  modulesCompleted: number
  modulesTotal: number
  nextSession: string
}

export interface PracticeRecord {
  level: string
  domain: string
  recentAccuracy: { label: string; pct: number }[]
  note: string
}

export interface LearnerProfile {
  /** Convenience copy of the base record. */
  record: LearnerRecord
  className: string
  adviser: string
  motherTongue: string
  pin: string
  classCode: string
  status: string
  formal: FormalAssessmentRecord | null
  practice: PracticeRecord | null
  intervention: InterventionRecord | null
  pedagogicalNote: string
}

/** Per-learner profile detail keyed by learner id. */
const PROFILE_DETAIL: Record<
  string,
  Omit<LearnerProfile, 'record' | 'status'>
> = {
  'AS-2041': {
    className: 'Sampaguita',
    adviser: 'Teacher Maria',
    motherTongue: 'Tagalog',
    pin: '2041',
    classCode: 'TALAS-G1',
    formal: {
      period: 'Q1 BoSY',
      classification: 'Full Refresher (Letter Sounds)',
      readerStage: 'Emergent Reader',
      dateFinalized: 'October 12, 2026',
      assessor: 'T. Reyes (Certified Evaluator)',
      miscues: '8 miscues (oral)',
      comprehension: '2 / 5 literal comprehension',
      phonemesFlagged: ['/m/', '/s/', '/a/'],
    },
    practice: {
      level: 'Level 2 — Marungko Set A (/m/, /s/, /a/)',
      domain: 'Filipino Reading',
      recentAccuracy: [
        { label: 'Mon, Oct 19', pct: 85 },
        { label: 'Wed, Oct 21', pct: 90 },
        { label: 'Fri, Oct 23', pct: 80 },
      ],
      note: 'Mastery threshold achieved across 3 consecutive sessions (avg 85%). System recommends promoting to Marungko Set B (/i/, /o/, /b/).',
    },
    intervention: {
      title: 'Targeted Phonemic Blending',
      tier: 'Active Tier 2',
      directive: 'Week 3 of 4',
      description:
        'Multi-sensory tactile sandpaper cards & sound wheel drill for rapid initial phoneme identification.',
      modulesCompleted: 3,
      modulesTotal: 5,
      nextSession: 'Thursday, 10:00 AM (15 mins)',
    },
    pedagogicalNote:
      'Amina exhibits high auditory recall when songs and hand gestures accompany the sound of /m/. Maintain kinesthetic reinforcement before shifting to non-pictorial text flashcards.',
  },
}

const FALLBACK_NOTE =
  'No pedagogical notes recorded yet for this learner.'

/** Builds a profile view for a learner id, or null if unknown. */
export function learnerProfile(id: string | undefined): LearnerProfile | null {
  if (!id) return null
  const record = LEARNERS.find((l) => l.id === id)
  if (!record) return null

  const detail = PROFILE_DETAIL[id]
  const className =
    detail?.className ??
    SECTIONS.find((s) => s.id === record.sectionId)?.label.split('·')[1]?.trim() ??
    record.sectionId

  return {
    record,
    className,
    adviser: detail?.adviser ?? 'Teacher Maria',
    motherTongue: detail?.motherTongue ?? 'Tagalog',
    pin: detail?.pin ?? record.id.replace(/\D/g, ''),
    classCode: detail?.classCode ?? `TALAS-${record.grade.replace(/\s/g, '')}`,
    status: record.level ? 'Active Learner' : 'Awaiting Assessment',
    formal: detail?.formal ?? null,
    practice: detail?.practice ?? null,
    intervention: detail?.intervention ?? null,
    pedagogicalNote: detail?.pedagogicalNote ?? FALLBACK_NOTE,
  }
}
