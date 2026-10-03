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
  /** Has a submitted assessment awaiting teacher review. */
  needsReview?: boolean
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
  { id: 'BR-3101', name: 'Bea Ramos', initials: 'BR', grade: 'Grade 3-A', sectionId: 'mabini', level: 'GR', lastActive: '10m ago', activeToday: true, needsReview: true },
  { id: 'GR-3012', name: 'Gabriel Reyes', initials: 'GR', grade: 'Grade 3-A', sectionId: 'mabini', level: 'LR', lastActive: '2h ago', activeToday: true },
  { id: 'LT-3044', name: 'Liza Tan', initials: 'LT', grade: 'Grade 3-A', sectionId: 'mabini', level: 'GR', lastActive: 'Yesterday', activeToday: false },

  // Grade 2 · Rosal
  { id: 'JD-1083', name: 'Juan Dela Cruz', initials: 'JD', grade: 'Grade 2-A', sectionId: 'rosal', level: 'MR', lastActive: 'Yesterday', activeToday: false },
  { id: 'CG-2210', name: 'Carlo Garcia', initials: 'CG', grade: 'Grade 2-A', sectionId: 'rosal', level: 'LR', lastActive: '25m ago', activeToday: true, needsReview: true },
  { id: 'MP-2255', name: 'Mika Perez', initials: 'MP', grade: 'Grade 2-A', sectionId: 'rosal', level: 'MR', lastActive: '3h ago', activeToday: true },

  // Grade 1 · Sampaguita
  { id: 'AS-2041', name: 'Amina Santos', initials: 'AS', grade: 'Grade 1-B', sectionId: 'sampaguita', level: 'FR', lastActive: '1h ago', activeToday: true },
  { id: 'SM-1120', name: 'Sofia Manuel', initials: 'SM', grade: 'Grade 1-B', sectionId: 'sampaguita', level: null, lastActive: '45m ago', activeToday: true, needsReview: true },
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

const CRLA_DESCRIPTION: Record<Exclude<CrlaLevel, null>, string> = {
  GR: 'Demonstrates mastery of previous concepts and is ready for grade-level reading instruction.',
  LR: 'Grasps basic concepts but needs practice to improve speed, accuracy, or minor skill gaps.',
  MR: 'Requires structured assistance, guided practice, and targeted intervention.',
  FR: 'Needs direct, intensive instruction starting from foundational concepts (such as letter sounds or phonological awareness).',
}

export function crlaDescription(level: CrlaLevel): string {
  return level
    ? CRLA_DESCRIPTION[level]
    : 'No formal reading classification on record yet.'
}

export type FormalAssessmentType = 'Oral' | 'Silent'

export interface FormalAssessmentRecord {
  id: string
  period: string
  /** Oral (read-aloud miscue/fluency) vs Silent (reading comprehension). */
  type: FormalAssessmentType
  classification: string
  readerStage: string
  dateFinalized: string
  assessor: string
  miscues: string
  comprehension: string
  phonemesFlagged: string[]
  /** Finalized formal records are read-only. */
  status: 'Finalized'
}

export type InterventionStatus = 'Active' | 'Completed' | 'Discontinued'

export interface InterventionRecord {
  id: string
  title: string
  tier: string
  /** Reading skill / need this plan targets. */
  targetSkill: string
  status: InterventionStatus
  dateAssigned: string
  directive: string
  description: string
  modulesCompleted: number
  modulesTotal: number
  nextSession: string
}

export type PracticeTrend = 'Improving' | 'Steady' | 'Needs attention'

export interface PracticeActivityEntry {
  date: string
  activity: string
  accuracyPct: number
  detail: string
}

export interface PracticeRecord {
  level: string
  domain: string
  trend: PracticeTrend
  recentAccuracy: { label: string; pct: number }[]
  history: PracticeActivityEntry[]
  note: string
}

export interface RecentActivityItem {
  date: string
  type: 'Formal Assessment' | 'Practice' | 'Intervention'
  label: string
  detail: string
}

export interface RecommendationItem {
  id: string
  /** Short recommendation text (system-generated next step). */
  detail: string
  /** What this recommendation is based on. */
  basis: string
  status: 'Pending' | 'Approved' | 'Dismissed'
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
  formalHistory: FormalAssessmentRecord[]
  practice: PracticeRecord | null
  intervention: InterventionRecord | null
  interventionHistory: InterventionRecord[]
  recommendations: RecommendationItem[]
  pedagogicalNote: string
  recentActivity: RecentActivityItem[]
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
      id: 'FA-AS-02',
      period: 'Q1 BoSY',
      type: 'Oral',
      classification: 'Full Refresher (Letter Sounds)',
      readerStage: 'Emergent Reader',
      dateFinalized: 'October 12, 2026',
      assessor: 'T. Reyes (Certified Evaluator)',
      miscues: '8 miscues (oral)',
      comprehension: '2 / 5 literal comprehension',
      phonemesFlagged: ['/m/', '/s/', '/a/'],
      status: 'Finalized',
    },
    formalHistory: [
      {
        id: 'FA-AS-02',
        period: 'Q1 BoSY',
        type: 'Oral',
        classification: 'Full Refresher (Letter Sounds)',
        readerStage: 'Emergent Reader',
        dateFinalized: 'October 12, 2026',
        assessor: 'T. Reyes (Certified Evaluator)',
        miscues: '8 miscues (oral)',
        comprehension: '2 / 5 literal comprehension',
        phonemesFlagged: ['/m/', '/s/', '/a/'],
        status: 'Finalized',
      },
      {
        id: 'FA-AS-01',
        period: 'Kindergarten EoSY',
        type: 'Silent',
        classification: 'Full Refresher (Letter Sounds)',
        readerStage: 'Pre-Emergent Reader',
        dateFinalized: 'March 20, 2026',
        assessor: 'T. Maria (Certified Evaluator)',
        miscues: 'n/a (silent)',
        comprehension: '1 / 5 literal comprehension',
        phonemesFlagged: ['/m/', '/s/', '/a/', '/i/'],
        status: 'Finalized',
      },
    ],
    practice: {
      level: 'Level 2 — Marungko Set A (/m/, /s/, /a/)',
      domain: 'Filipino Reading',
      trend: 'Improving',
      recentAccuracy: [
        { label: 'Mon, Oct 19', pct: 85 },
        { label: 'Wed, Oct 21', pct: 90 },
        { label: 'Fri, Oct 23', pct: 80 },
      ],
      history: [
        { date: 'Oct 23, 2026', activity: 'Marungko Set A drill', accuracyPct: 80, detail: '12 of 15 words correct' },
        { date: 'Oct 21, 2026', activity: 'Marungko Set A drill', accuracyPct: 90, detail: 'Personal best this week' },
        { date: 'Oct 19, 2026', activity: 'Marungko Set A drill', accuracyPct: 85, detail: '13 of 15 words correct' },
        { date: 'Oct 16, 2026', activity: 'Letter-sound warm-up', accuracyPct: 70, detail: '/m/, /s/ focus set' },
      ],
      note: 'Mastery threshold achieved across 3 consecutive sessions (avg 85%). System recommends promoting to Marungko Set B (/i/, /o/, /b/).',
    },
    intervention: {
      id: 'IV-AS-02',
      title: 'Targeted Phonemic Blending',
      tier: 'Active Tier 2',
      targetSkill: 'Initial phoneme identification (/m/, /s/, /a/)',
      status: 'Active',
      dateAssigned: 'October 14, 2026',
      directive: 'Week 3 of 4',
      description:
        'Multi-sensory tactile sandpaper cards & sound wheel drill for rapid initial phoneme identification.',
      modulesCompleted: 3,
      modulesTotal: 5,
      nextSession: 'Thursday, 10:00 AM (15 mins)',
    },
    interventionHistory: [
      {
        id: 'IV-AS-01',
        title: 'Letter-Sound Readiness',
        tier: 'Tier 1',
        targetSkill: 'Letter-sound correspondence (vowels)',
        status: 'Completed',
        dateAssigned: 'September 2, 2026',
        directive: '4 of 4 weeks',
        description:
          'Picture-sound matching and vowel song routines to build baseline letter-sound awareness.',
        modulesCompleted: 4,
        modulesTotal: 4,
        nextSession: '—',
      },
    ],
    pedagogicalNote:
      'Amina exhibits high auditory recall when songs and hand gestures accompany the sound of /m/. Maintain kinesthetic reinforcement before shifting to non-pictorial text flashcards.',
    recentActivity: [
      { date: 'Oct 23, 2026', type: 'Practice', label: 'Marungko Set A drill', detail: '80% accuracy · 12 of 15 words' },
      { date: 'Oct 22, 2026', type: 'Intervention', label: 'Phonemic blending pull-out', detail: 'Module 3 of 5 completed' },
      { date: 'Oct 21, 2026', type: 'Practice', label: 'Marungko Set A drill', detail: '90% accuracy · personal best' },
      { date: 'Oct 12, 2026', type: 'Formal Assessment', label: 'CRLA BoSY finalized', detail: 'Full Refresher — Letter Sounds' },
    ],
    recommendations: [
      {
        id: 'R-01',
        detail: 'Promote to Marungko Set B (/i/, /o/, /b/) after 3 consecutive mastery sessions.',
        basis: 'Based on recent practice performance (avg 85% across 3 sessions).',
        status: 'Pending',
      },
    ],
  },

  // ── Grade 2 · Rosal ──────────────────────────────────────────────
  'CG-2210': {
    className: 'Rosal',
    adviser: 'Teacher Elena',
    motherTongue: 'Cebuano',
    pin: '2210',
    classCode: 'TALAS-G2',
    formal: {
      id: 'FA-CG-02',
      period: 'Q1 BoSY',
      type: 'Oral',
      classification: 'Light Refresher (Fluency)',
      readerStage: 'Transitional Reader',
      dateFinalized: 'October 10, 2026',
      assessor: 'T. Reyes (Certified Evaluator)',
      miscues: '4 miscues (oral)',
      comprehension: '4 / 5 literal comprehension',
      phonemesFlagged: ['/ng/', '/ts/'],
      status: 'Finalized',
    },
    formalHistory: [
      {
        id: 'FA-CG-02',
        period: 'Q1 BoSY',
        type: 'Oral',
        classification: 'Light Refresher (Fluency)',
        readerStage: 'Transitional Reader',
        dateFinalized: 'October 10, 2026',
        assessor: 'T. Reyes (Certified Evaluator)',
        miscues: '4 miscues (oral)',
        comprehension: '4 / 5 literal comprehension',
        phonemesFlagged: ['/ng/', '/ts/'],
        status: 'Finalized',
      },
      {
        id: 'FA-CG-01',
        period: 'Grade 1 EoSY',
        type: 'Silent',
        classification: 'Moderate Refresher (Comprehension)',
        readerStage: 'Emergent Reader',
        dateFinalized: 'March 18, 2026',
        assessor: 'T. Elena (Certified Evaluator)',
        miscues: 'n/a (silent)',
        comprehension: '3 / 5 literal comprehension',
        phonemesFlagged: ['/ng/', '/ts/', '/ly/'],
        status: 'Finalized',
      },
    ],
    practice: {
      level: 'Level 4 — Fluency Phrasing Set B',
      domain: 'Filipino Reading',
      trend: 'Steady',
      recentAccuracy: [
        { label: 'Mon, Oct 19', pct: 78 },
        { label: 'Wed, Oct 21', pct: 82 },
        { label: 'Fri, Oct 23', pct: 80 },
      ],
      history: [
        { date: 'Oct 23, 2026', activity: 'Phrase-reading drill', accuracyPct: 80, detail: '8 of 10 phrases smooth' },
        { date: 'Oct 21, 2026', activity: 'Phrase-reading drill', accuracyPct: 82, detail: 'Improved pacing' },
        { date: 'Oct 19, 2026', activity: 'Sight-word sprint', accuracyPct: 78, detail: '/ng/ blends still slow' },
        { date: 'Oct 16, 2026', activity: 'Passage read-aloud', accuracyPct: 75, detail: 'Timed 1-min passage' },
      ],
      note: 'Steady fluency gains but prosody plateau. System suggests expressive read-aloud modeling before advancing.',
    },
    intervention: {
      id: 'IV-CG-02',
      title: 'Fluency & Phrasing Booster',
      tier: 'Active Tier 1',
      targetSkill: 'Reading rate and phrasing (connected text)',
      status: 'Active',
      dateAssigned: 'October 13, 2026',
      directive: 'Week 2 of 4',
      description:
        'Repeated-reading and echo-reading routines with timed one-minute passages to build automaticity.',
      modulesCompleted: 2,
      modulesTotal: 4,
      nextSession: 'Wednesday, 1:30 PM (15 mins)',
    },
    interventionHistory: [
      {
        id: 'IV-CG-01',
        title: 'Blend Decoding Review',
        tier: 'Tier 1',
        targetSkill: 'Consonant digraph decoding (/ng/, /ts/)',
        status: 'Completed',
        dateAssigned: 'September 5, 2026',
        directive: '3 of 3 weeks',
        description:
          'Word-sort and blending-ladder activities targeting Filipino consonant digraphs.',
        modulesCompleted: 3,
        modulesTotal: 3,
        nextSession: '—',
      },
    ],
    pedagogicalNote:
      'Carlo decodes accurately but reads word-by-word. Prioritize prosody and phrasing over speed; model expressive reading before each drill.',
    recentActivity: [
      { date: 'Oct 23, 2026', type: 'Practice', label: 'Phrase-reading drill', detail: '80% accuracy · 8 of 10 phrases' },
      { date: 'Oct 22, 2026', type: 'Intervention', label: 'Fluency booster pull-out', detail: 'Module 2 of 4 completed' },
      { date: 'Oct 21, 2026', type: 'Practice', label: 'Phrase-reading drill', detail: '82% accuracy · improved pacing' },
      { date: 'Oct 10, 2026', type: 'Formal Assessment', label: 'CRLA BoSY finalized', detail: 'Light Refresher — Fluency' },
    ],
    recommendations: [
      {
        id: 'R-CG-01',
        detail: 'Introduce expressive read-aloud modeling to lift prosody before advancing fluency level.',
        basis: 'Based on steady accuracy (avg 80%) with flat phrasing scores.',
        status: 'Pending',
      },
    ],
  },

  // ── Grade 3 · Mabini ─────────────────────────────────────────────
  'BR-3101': {
    className: 'Mabini',
    adviser: 'Teacher Jaime',
    motherTongue: 'Tagalog',
    pin: '3101',
    classCode: 'TALAS-G3',
    formal: {
      id: 'FA-BR-02',
      period: 'Q1 BoSY',
      type: 'Silent',
      classification: 'Grade Ready',
      readerStage: 'Independent Reader',
      dateFinalized: 'October 9, 2026',
      assessor: 'T. Jaime (Certified Evaluator)',
      miscues: 'n/a (silent)',
      comprehension: '5 / 5 literal · 3 / 4 inferential',
      phonemesFlagged: [],
      status: 'Finalized',
    },
    formalHistory: [
      {
        id: 'FA-BR-02',
        period: 'Q1 BoSY',
        type: 'Silent',
        classification: 'Grade Ready',
        readerStage: 'Independent Reader',
        dateFinalized: 'October 9, 2026',
        assessor: 'T. Jaime (Certified Evaluator)',
        miscues: 'n/a (silent)',
        comprehension: '5 / 5 literal · 3 / 4 inferential',
        phonemesFlagged: [],
        status: 'Finalized',
      },
      {
        id: 'FA-BR-01',
        period: 'Grade 2 EoSY',
        type: 'Oral',
        classification: 'Light Refresher (Fluency)',
        readerStage: 'Transitional Reader',
        dateFinalized: 'March 15, 2026',
        assessor: 'T. Jaime (Certified Evaluator)',
        miscues: '3 miscues (oral)',
        comprehension: '4 / 5 literal comprehension',
        phonemesFlagged: ['/pr/'],
        status: 'Finalized',
      },
    ],
    practice: {
      level: 'Level 6 — Comprehension Challenge Set A',
      domain: 'Filipino Reading',
      trend: 'Improving',
      recentAccuracy: [
        { label: 'Mon, Oct 19', pct: 88 },
        { label: 'Wed, Oct 21', pct: 92 },
        { label: 'Fri, Oct 23', pct: 95 },
      ],
      history: [
        { date: 'Oct 23, 2026', activity: 'Inferential questions set', accuracyPct: 95, detail: '19 of 20 correct' },
        { date: 'Oct 21, 2026', activity: 'Short-passage comprehension', accuracyPct: 92, detail: 'Strong main-idea recall' },
        { date: 'Oct 19, 2026', activity: 'Vocabulary-in-context drill', accuracyPct: 88, detail: 'Two context clues missed' },
        { date: 'Oct 16, 2026', activity: 'Silent reading log', accuracyPct: 90, detail: '2 chapters, self-paced' },
      ],
      note: 'Consistently above mastery threshold. System recommends enrichment with inferential and critical-thinking passages.',
    },
    intervention: null,
    interventionHistory: [
      {
        id: 'IV-BR-01',
        title: 'Comprehension Strategy Group',
        tier: 'Tier 1',
        targetSkill: 'Inferential comprehension (predicting, inferring)',
        status: 'Completed',
        dateAssigned: 'August 28, 2026',
        directive: '4 of 4 weeks',
        description:
          'Small-group reciprocal teaching with question-generation and summarizing routines.',
        modulesCompleted: 4,
        modulesTotal: 4,
        nextSession: '—',
      },
    ],
    pedagogicalNote:
      'Bea is at grade level and ready for enrichment. Offer open-ended inferential prompts and let her lead peer reading circles to sustain engagement.',
    recentActivity: [
      { date: 'Oct 23, 2026', type: 'Practice', label: 'Inferential questions set', detail: '95% accuracy · 19 of 20' },
      { date: 'Oct 21, 2026', type: 'Practice', label: 'Short-passage comprehension', detail: '92% accuracy · main-idea recall' },
      { date: 'Oct 16, 2026', type: 'Practice', label: 'Silent reading log', detail: '2 chapters, self-paced' },
      { date: 'Oct 9, 2026', type: 'Formal Assessment', label: 'CRLA BoSY finalized', detail: 'Grade Ready' },
    ],
    recommendations: [
      {
        id: 'R-BR-01',
        detail: 'Move to Comprehension Challenge Set B with critical-thinking prompts for enrichment.',
        basis: 'Based on sustained mastery performance (avg 92% across 3 sessions).',
        status: 'Pending',
      },
    ],
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
    formalHistory: detail?.formalHistory ?? (detail?.formal ? [detail.formal] : []),
    practice: detail?.practice ?? null,
    intervention: detail?.intervention ?? null,
    interventionHistory: detail?.interventionHistory ?? [],
    recommendations: detail?.recommendations ?? [],
    pedagogicalNote: detail?.pedagogicalNote ?? FALLBACK_NOTE,
    recentActivity: detail?.recentActivity ?? [],
  }
}
