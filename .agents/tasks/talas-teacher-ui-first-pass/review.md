# Teacher UI first pass: dashboard, profile, assign, and review screens

The change adds the teacher-facing side of TALAS as a self-contained slice: a design-system refresh in `index.css`, a typed mock-data module, a small shared UI-primitive file, a `useState` screen-switch router in `App.tsx`, and six screens under `src/screens/teacher/`. The approach honors the task's constraints — inline styles over CSS files, a state machine instead of react-router, and mock data instead of any learner-side or backend dependency. Navigation flows dashboard → learner profile / assign / pending review, and pending review → oral or silent review, each with a working back path. The plan's verification note records `npm run build` (`tsc -b && vite build`) exiting 0 with zero TypeScript errors under the project's strict flags.

Watch for: nothing blocking. Two non-blocking first-pass behaviors — the LearnerProfile "formal assessments" section lists all of a learner's submissions rather than filtering to formal assignments (confirmed), and LearnerProfile's "Mag-assign" drops the selected-learner context since the assign screen takes no learner id (confirmed). Both are acceptable for a mock-only first pass.

**Verdict**: APPROVED

## High-level view

The design system in `index.css` is correct: the Google Fonts `@import` is the first line (before the Tailwind import, as CSS requires), all ten TALAS tokens are present on `:root`, `#root` is reduced to `width:100%; min-height:100svh` with the Vite `width:1126px` shell removed, and the dark-mode block and starter `h1/code/.counter` rules are gone. Font utility classes are added. `App.css` is emptied to a single comment, and `App.tsx` keeps only `import './App.css'` with no boilerplate — consistent with the plan.

`App.tsx` is a `useState` state machine with the exact `TeacherScreen` union, `selectedLearnerId`/`selectedSubmissionId` state, and conditional rendering (no `switch`, avoiding the `noFallthroughCasesInSwitch` risk). Null-guards fall back to a sensible screen (dashboard when no learner, pending-review when no submission) rather than rendering a broken screen. `main.tsx` is untouched.

The mock-data module exports the specified interfaces and all five helper selectors. Volumes meet the spec: 7 learners across both sections and Grades 1–3, 3 formal assignments (two active, one closed), 6 submissions mixing oral and silent with five pending, and histories for three learners. Every submission's `learnerId` and `assignmentId` resolves to a real entity, and oral vs silent fields are populated on the correct records with no cross-contamination.

The six screens carry Filipino labels throughout, pull from the mock selectors, and share the inline-styled primitives in `components/ui.tsx`. Styling is restrained and structured — white cards, thin borders, a green primary action, no mascot. Responsiveness comes from `auto-fit minmax` stat grids, `min()`/`clamp()` container widths, and a `useIsMobile()` hook that swaps the dashboard table and pending-review rows to stacked cards under 640px. No container uses a fixed pixel width.

Scope is clean: the diff touches only `index.css`, `App.css`, `App.tsx`, the new teacher files, and the plan doc. No Amplify/backend, learner code, or `main.tsx` change, and `package.json`/`package-lock.json` are unchanged (no new packages).

<details>
<summary>Issues (2)</summary>

1. **Formal-assessment section shows all submissions** — LearnerProfile's "Mga Nakaraang Pagtatasa (Pormal)" renders every submission for the learner (`formalSubmissions = learnerSubmissions`) instead of filtering to formal assignments. Non-blocking for a mock pass; narrow if a true formal-only view is wanted later.
2. **Assign loses learner context from profile** — LearnerProfile's "Mag-assign ng Pagtatasa" routes to `AssignAssessment`, which takes no `learnerId` and starts with an empty selection, so the learner the teacher was viewing isn't pre-selected. Non-blocking; consider passing/pre-checking the learner in a later pass.

</details>

<details>
<summary>Details</summary>

### Design system reset in index.css

The token layer matches the spec exactly. The font `@import url(...Comfortaa...Plus+Jakarta+Sans...Quicksand...)` is the first statement, satisfying the CSS rule that `@import` precedes other rules, and sits before `@import 'tailwindcss'`. `:root` carries all ten tokens (`--talas-paper/green/yellow/blue/charcoal/coral/mint/buttercream/sky/radius-card`). The universal `box-sizing` reset is present, `body` sets the paper background, charcoal text, and Jakarta font, and `#root` is reduced to `width:100%; min-height:100svh` — the fixed `1126px` width, `border-inline`, `text-align:center`, and flex column from the Vite starter are gone, as is the `@media (prefers-color-scheme: dark)` block and the boilerplate type rules. The three font utility classes are added.

### Router and boilerplate removal in App.tsx

The router is a `useState` state machine keyed on the `TeacherScreen` union with `selectedLearnerId`/`selectedSubmissionId`. Screen selection is a chain of early-returning `if` blocks (not a `switch`), so there's no fallthrough exposure. The two null-guards are worth calling out as a correct failure mode: entering `learner-profile` without a selected learner falls back to the dashboard, and entering a review screen without a submission falls back to pending-review, so a stale/empty id can't render a screen that would dereference `undefined`. Back and complete callbacks route where the plan specifies (reviews return to pending; profile/assign return to dashboard). The only non-screen import is `./App.css`, which is emptied; no logo/hero/counter imports remain.

### Mock data shape and referential integrity

The interfaces (`Learner`, `AssessmentAssignment`, `Submission` with split oral/silent optional fields, `SilentAnswer`, `ReadingProfileHistory`/`Entry`) use string-literal unions rather than enums, satisfying `erasableSyntaxOnly`. Referential integrity holds across the fixtures: every `submission.learnerId` (`l1`–`l5`, `l7`) and `assignmentId` (`a1`,`a2`) exists, and every `assignment.assignedTo` id exists. Oral submissions carry `passageText`/`audioDurationSec`/`wordsCorrect`/`wordsTotal` and omit the silent fields; silent submissions carry `score`/`totalQuestions`/`answers` and omit the oral fields — no record mixes the two. Five of six submissions are pending with one reviewed, giving the pending list real content while exercising the `reviewed` status. All five helper selectors are present and type-correct.

### Shared primitives and responsiveness

`components/ui.tsx` centralizes `Card`, `StatCard`, `Badge` (four token-backed variants), `PrimaryButton`/`SecondaryButton`/`BackButton`, `SectionHeading`, and the `useIsMobile()` hook. The hook reads `matchMedia('(max-width: 639px)')`, subscribes with `addEventListener('change', ...)`, and removes the listener on cleanup, so the table↔card switch stays in sync without a leak. Container widths use `min(640–1080px, 100%)` with `clamp()` padding, and the stat row uses `repeat(auto-fit, minmax(180px,1fr))` — no fixed-width shell anywhere. The dashboard renders a structured table on wider viewports and stacked `LearnerCard`s under 640px; pending-review rows flip to a column layout with full-width buttons on mobile. Styling is deliberately restrained (white cards, `#E5E7EB` borders, green primary) with no mascot, matching the "more restrained and structured than the learner side" instruction.

### Screen behaviors and Filipino labels

Each screen resolves its data through the selectors and guards the not-found case with a friendly Filipino empty state ("Hindi natagpuan ang..."). OralReview presents the mock audio panel (play/pause toggling `isPlaying`, static waveform bars, `mm:ss` duration from `audioDurationSec`), the passage in `.font-quicksand` with a "X sa Y salita tama" line, a computed accuracy percentage, a 1–5 fluency selector, and a notes textarea — all local state, no persistence, as required. SilentReview shows the auto-score as `score/total` plus a percentage, a per-answer breakdown with green check / coral x driven by `isCorrect` (revealing the correct answer only on misses), a notes field, and — correctly — no read-aloud control. AssignAssessment is a controlled form with per-section "Piliin/Alisin lahat" toggles, a read-only type field, date input, and `≥1 learner` validation that blocks submit with an inline Filipino message before showing the success confirmation. Labels across all screens are Filipino ("Mga Mag-aaral", "Mag-assign ng Pagtatasa", "Tapusin ang Review", "Awtomatikong Iskor", etc.).

### Verification evidence

Per the task instruction, I did not re-run the build. The plan's appended verification note records the command (`npm run build` = `tsc -b && vite build`) run from the project root, exit code 0, zero TypeScript errors under `noUnusedLocals`/`noUnusedParameters`/`verbatimModuleSyntax`/`erasableSyntaxOnly`/`noFallthroughCasesInSwitch`, and a produced `dist/`. The diff is consistent with that result: type-only imports use `import type` (e.g. `BadgeVariant`, `ReadingLevel`, `Submission`), runtime helpers use value imports, and I found no unused imports or params in the reviewed files. Evidence is present, so no spot-check type-check was warranted.

</details>

<details>
<summary>File map</summary>

- `src/index.css` — TALAS tokens, font import first, `#root` fixed-width removed, dark-mode/boilerplate rules deleted, font utilities added.
- `src/App.css` — emptied to a single comment (starter styles removed).
- `src/App.tsx` — `useState` teacher state-machine router; all Vite boilerplate removed.
- `src/components/ui.tsx` — shared inline-styled primitives + `useIsMobile()` hook.
- `src/data/teacherMockData.ts` — typed interfaces, mock learners/assignments/submissions/histories, five selectors.
- `src/screens/teacher/TeacherDashboard.tsx` — stats, learner table/cards, primary actions.
- `src/screens/teacher/LearnerProfile.tsx` — header, formal record, practice history, assign action.
- `src/screens/teacher/AssignAssessment.tsx` — controlled assign form with section toggles and validation.
- `src/screens/teacher/PendingReview.tsx` — pending submissions list routing to oral/silent review.
- `src/screens/teacher/OralReview.tsx` — mock audio panel, passage, accuracy, fluency, notes.
- `src/screens/teacher/SilentReview.tsx` — auto-score summary, answer breakdown, notes.
- `.agents/tasks/talas-teacher-ui-first-pass/plan.md` — implementation plan + verification note.

Full diff: `git diff main` from `c:\Users\ashai\TALAS`.

</details>
