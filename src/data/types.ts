/**
 * TALAS — minimal domain contracts (Hour 1 Foundation).
 *
 * These are the shared types the whole app builds on. Keep them small and
 * stable: teammates (Shai/Oliver) wire UI against these, so changes here ripple.
 *
 * Everything is persisted locally in IndexedDB (see `db.ts`). IDs are plain
 * strings so stores can be seeded deterministically.
 */

/** ISO-8601 timestamp, e.g. "2026-10-03T09:00:00.000Z". */
export type ISODateString = string;

/**
 * Sync bookkeeping mixed into every persisted entity. All fields are optional
 * so existing/seed data stays valid, but the repository layer (see
 * `repository.ts`) always stamps `updatedAt` and `dirty` on write.
 *
 * - `updatedAt`: last local mutation time; drives last-write-wins.
 * - `dirty`: true when the record has local changes not yet pushed to the server.
 * - `deleted`: soft-delete tombstone so deletions can sync.
 * - `syncedAt`: last time this record was confirmed in sync with the server.
 */
export interface SyncMeta {
  updatedAt?: ISODateString;
  dirty?: boolean;
  deleted?: boolean;
  syncedAt?: ISODateString;
}

/** A person who learns. Shown in the teacher dashboard and has a profile page. */
export interface Learner extends SyncMeta {
  id: string;
  name: string;
  /** Short handle / preferred name used in compact UI. */
  displayName?: string;
  /** Optional avatar URL or asset path. */
  avatarUrl?: string;
  /** Grade band or cohort label, free-form for now (e.g. "Grade 7"). */
  grade?: string;
  createdAt: ISODateString;
}

/** A teacher owns learners and assigns assessments. */
export interface Teacher extends SyncMeta {
  id: string;
  name: string;
  email?: string;
  createdAt: ISODateString;
}

/** Question types supported by the minimal assessment engine. */
export type QuestionType = "multiple-choice" | "short-answer";

export interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  /** Present for multiple-choice questions. */
  choices?: string[];
  /** Index into `choices` (multiple-choice) or expected text (short-answer). */
  answer?: number | string;
  /** Points this question is worth. Defaults to 1 if omitted. */
  points?: number;
}

/** A reusable assessment definition (a quiz / test template). */
export interface Assessment extends SyncMeta {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  questions: Question[];
  createdAt: ISODateString;
}

/** Lifecycle of an assignment given to a specific learner. */
export type AssignmentStatus =
  | "assigned"
  | "in-progress"
  | "submitted"
  | "graded";

/**
 * An Assessment handed to a Learner. This is the join between a learner and an
 * assessment, plus the learner's progress/score for that attempt.
 */
export interface Assignment extends SyncMeta {
  id: string;
  assessmentId: string;
  learnerId: string;
  assignedBy: string; // teacher id
  status: AssignmentStatus;
  assignedAt: ISODateString;
  dueAt?: ISODateString;
  /** Learner answers keyed by question id. */
  responses?: Record<string, number | string>;
  /** 0–100 once graded. */
  score?: number;
  completedAt?: ISODateString;
}

/**
 * Names of the entity object stores. Single source of truth. These all hold
 * records keyed by `id` and participate in sync.
 */
export const STORES = {
  learners: "learners",
  teachers: "teachers",
  assessments: "assessments",
  assignments: "assignments",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

/** All entity store names as an array (handy for iterating during sync). */
export const STORE_NAMES = Object.values(STORES) as StoreName[];

/**
 * Key-value store for sync bookkeeping (last pull time, in-flight flag). Keyed
 * by a plain string key, separate from the entity stores above.
 */
export const SYNC_STATE_STORE = "syncState" as const;

/** Known keys in the syncState store. */
export const SYNC_KEYS = {
  /** ISODateString of the last successful pull (the `since` cursor). */
  lastPulledAt: "lastPulledAt",
  /** "1" while a sync is running; guards against concurrent runs. */
  inFlight: "inFlight",
} as const;

/** Maps a store name to the entity type it holds. */
export interface StoreEntityMap {
  learners: Learner;
  teachers: Teacher;
  assessments: Assessment;
  assignments: Assignment;
}

/** Any persisted entity (union across the entity stores). */
export type Entity = StoreEntityMap[StoreName];

/** A single change in the sync protocol. */
export interface SyncChange {
  store: StoreName;
  op: "put" | "delete";
  record: Entity;
}

/** Request body for `POST /sync`. */
export interface SyncRequest {
  since: ISODateString | null;
  changes: SyncChange[];
}

/** Response body from `POST /sync`. */
export interface SyncResponse {
  serverTime: ISODateString;
  changes: SyncChange[];
}
