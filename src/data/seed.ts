/**
 * TALAS — seed data + idempotent seeding routine (Hour 1 Foundation).
 *
 * Seeds a known starting state so the app is demoable immediately:
 *   - one teacher
 *   - two learners: Maria & Amina
 *   - one assessment (a short math quiz)
 *   - one assignment: that assessment given to Maria
 *
 * `seedDatabase()` is idempotent — it only writes when stores are empty, so it
 * is safe to call on every app startup.
 */

import { STORES } from "./types";
import type { Assessment, Assignment, Learner, Teacher } from "./types";
import { count, openDB, put } from "./db";

/** Fixed timestamp so seeded data is deterministic across runs. */
const SEED_TIME = "2026-10-03T09:00:00.000Z";

export const TEACHER: Teacher = {
  id: "teacher-bert",
  name: "Bert",
  email: "bert@talas.app",
  createdAt: SEED_TIME,
  updatedAt: SEED_TIME,
};

export const LEARNER_MARIA: Learner = {
  id: "learner-maria",
  name: "Maria",
  displayName: "Maria",
  grade: "Grade 7",
  createdAt: SEED_TIME,
  updatedAt: SEED_TIME,
};

export const LEARNER_AMINA: Learner = {
  id: "learner-amina",
  name: "Amina",
  displayName: "Amina",
  grade: "Grade 7",
  createdAt: SEED_TIME,
  updatedAt: SEED_TIME,
};

export const ASSESSMENT_MATH: Assessment = {
  id: "assessment-math-basics",
  title: "Math Basics Quiz",
  description: "A short warm-up covering arithmetic fundamentals.",
  subject: "Mathematics",
  createdAt: SEED_TIME,
  updatedAt: SEED_TIME,
  questions: [
    {
      id: "q1",
      prompt: "What is 7 + 5?",
      type: "multiple-choice",
      choices: ["10", "11", "12", "13"],
      answer: 2,
      points: 1,
    },
    {
      id: "q2",
      prompt: "What is 9 × 3?",
      type: "multiple-choice",
      choices: ["18", "24", "27", "30"],
      answer: 2,
      points: 1,
    },
    {
      id: "q3",
      prompt: "Write the number that comes after 199.",
      type: "short-answer",
      answer: "200",
      points: 1,
    },
  ],
};

/** The one seeded assignment: Math Basics given to Maria by Bert. */
export const ASSIGNMENT_MARIA_MATH: Assignment = {
  id: "assignment-maria-math",
  assessmentId: ASSESSMENT_MATH.id,
  learnerId: LEARNER_MARIA.id,
  assignedBy: TEACHER.id,
  status: "assigned",
  assignedAt: SEED_TIME,
  dueAt: "2026-10-10T09:00:00.000Z",
  updatedAt: SEED_TIME,
};

/**
 * Seeds the database once. Returns `true` if seed data was written, `false` if
 * the DB already had data and seeding was skipped.
 */
export async function seedDatabase(): Promise<boolean> {
  // Make sure the stores exist before we count/write.
  await openDB();

  const existing =
    (await count(STORES.learners)) +
    (await count(STORES.teachers)) +
    (await count(STORES.assessments)) +
    (await count(STORES.assignments));

  if (existing > 0) {
    return false;
  }

  // Mark seeded records `dirty` so the first sync pushes them to the backend.
  // (Without this, seed data would only ever live locally until it was edited.)
  await put(STORES.teachers, { ...TEACHER, dirty: true });
  await put(STORES.learners, { ...LEARNER_MARIA, dirty: true });
  await put(STORES.learners, { ...LEARNER_AMINA, dirty: true });
  await put(STORES.assessments, { ...ASSESSMENT_MATH, dirty: true });
  await put(STORES.assignments, { ...ASSIGNMENT_MARIA_MATH, dirty: true });

  return true;
}
