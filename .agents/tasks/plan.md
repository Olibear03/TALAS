# Implementation Plan — TALAS Practice Flow Fix

This plan is implemented as three FEAT artifacts under `.agents/tasks/task-talas-practice-flow-fix/`.
See that directory for full step detail. Summary below.

---

## FEAT-001 — Replace practiceData.ts data layer

- [ ] 1. Remove the `PracticeActivity` interface and `practiceActivities` array from `src/data/practiceData.ts`.
      These are the catalog exposed to learners. All other existing exports stay.
      Files: `src/data/practiceData.ts`
      Verify: Part of combined build — see FEAT-002 verify step.

- [ ] 2. Add `PracticeActivityDef` interface, `PracticeProfile` interface, and `activityRegistry` array (7 entries, levels 1–3).
      Files: `src/data/practiceData.ts`
      Verify: Part of combined build.

- [ ] 3. Add `getNextPracticeActivity(profile: PracticeProfile): PracticeActivityDef` function.
      Filters registry to current level, excludes last completed ID, picks first match deterministically, falls back to level 1.
      Files: `src/data/practiceData.ts`
      Verify: Part of combined build.

- [ ] 4. Add `updatePracticeLevel(profile: PracticeProfile, scorePercent: number, completedActivityId: string): PracticeProfile` function.
      Rules: ≥80 for 3 consecutive → level up (max 3); 60–79 → stay; <60 for 2 consecutive → level down (min 1). Appends score to recentScores (last 10), appends ID to completedActivityIds (last 20). Returns new object (no mutation).
      Files: `src/data/practiceData.ts`
      Verify: Part of combined build.

---

## FEAT-002 — Delete PracticeLobby, create PracticeCompletion, update activity onComplete signatures

- [ ] 5. Delete `src/screens/learner/PracticeLobby.tsx`.
      Files: DELETE `src/screens/learner/PracticeLobby.tsx`
      Verify: File should not exist after deletion.

- [ ] 6. Update `ComprehensionActivity`, `VocabularyActivity`, `ReadAloudActivity`, `WordPracticeActivity` — change `onComplete` prop from `() => void` to `(scorePercent: number) => void`. Remove internal done-state screens and call `onComplete(score)` directly.
      - ComprehensionActivity: replace `setPhase('done')` with `onComplete(Math.round((correctCount / questions.length) * 100))`. Remove the `if (phase === 'done')` block.
      - VocabularyActivity: replace `setDone(true)` with `onComplete(Math.round((correctCount / vocabularyItems.length) * 100))`. Remove done state + render.
      - ReadAloudActivity: replace `() => setDone(true)` on the finish button with `() => onComplete(-1)`. Remove done state + render.
      - WordPracticeActivity: replace `setDone(true)` with `onComplete(Math.round((correctCount / wordPracticeItems.length) * 100))`. Remove done state + render.
      Files: `src/screens/learner/practice/ComprehensionActivity.tsx`, `VocabularyActivity.tsx`, `ReadAloudActivity.tsx`, `WordPracticeActivity.tsx`
      Verify: Part of combined build.

- [ ] 7. Rewrite `src/screens/learner/practice/PracticeActivity.tsx` to accept `onComplete: (scorePercent: number) => void` and add cases for `practice-005` (VocabularyActivity), `practice-006` (VocabularyActivity), `practice-007` (ComprehensionActivity). Update default-case `onComplete` call to `onComplete(0)`.
      Files: `src/screens/learner/practice/PracticeActivity.tsx`
      Verify: Part of combined build.

- [ ] 8. Create `src/screens/learner/PracticeCompletion.tsx`.
      Props: `{ learnerName, activityTitle, scorePercent, onKeepPracticing, onBackToDashboard }`.
      Renders: FrogMascot (size 120), 'Mahusay! 🎉' heading (Comfortaa, var(--talas-green), 28px bold), activity title paragraph, optional score badge (var(--talas-buttercream), shows `${scorePercent}%` or 'Tapos na! ✓' if scorePercent===-1), conditional encouragement text (green/muted/coral based on score), 'Magpatuloy sa Pagsasanay 💪' green full-width button, 'Bumalik sa Dashboard' outline button. Width: min(480px, 100%), margin: 0 auto, padding: clamp(12px, 4vw, 24px).
      Files: `src/screens/learner/PracticeCompletion.tsx`
      Verify: Part of combined build.

---

## FEAT-003 — App.tsx wiring + responsive layout

- [ ] 9. Rewrite `src/App.tsx` practice flow wiring.
      - Remove PracticeLobby import; add PracticeCompletion import.
      - Add imports: `getNextPracticeActivity`, `updatePracticeLevel`, `PracticeProfile`, `PracticeActivityDef` from `./data/practiceData`.
      - Remove `'practice-lobby'` from Screen type; add `'practice-completion'`.
      - Add state: `practiceProfile` (PracticeProfile, initial currentLevel: 2), `lastActivityTitle` (string), `lastScorePercent` (number, initial 0). Keep `activeActivityId`.
      - Replace `handleSelectActivity` with `handleStartPractice`: calls `getNextPracticeActivity(practiceProfile)`, sets activityId + title, navigates to `'practice-activity'`.
      - New `handleActivityComplete(scorePercent: number)`: calls `updatePracticeLevel`, sets profile, sets lastScorePercent, navigates to `'practice-completion'`.
      - New `handleKeepPracticing()`: calls `getNextPracticeActivity(practiceProfile)` (reads updated state), sets activityId + title, navigates to `'practice-activity'`.
      - Remove `'practice-lobby'` case from switch; add `'practice-completion'` case rendering `<PracticeCompletion>`.
      - Update `'dashboard'` case: `onStartPractice={handleStartPractice}` (was `onGoToPractice`).
      - Update `'practice-activity'` case: `onBack={() => setCurrentScreen('dashboard')}`.
      Files: `src/App.tsx`
      Verify: `npm run build` — zero TS errors.

- [ ] 10. Update `src/screens/learner/LearnerDashboard.tsx`.
       - Rename prop `onGoToPractice` to `onStartPractice: () => void`.
       - Outer wrapper: `maxWidth: '700px'` → `width: 'min(900px, 100%)'`, `padding: '16px'` → `padding: 'clamp(12px, 4vw, 32px)'`.
       - Replace the 2-column grid (two activity preview cards + 'Tingnan Lahat ng Aktibidad' button) with a single mint-background card containing a 💪 icon, 'May bagong pagsasanay para sa iyo!' text, and a single full-width green 'Magsanay Tayo! 💪' button calling `onStartPractice`.
       Files: `src/screens/learner/LearnerDashboard.tsx`
       Verify: `npm run build` — zero TS errors.

- [ ] 11. Apply responsive width fixes to remaining screens.
       - `src/screens/learner/LearnerAccess.tsx`: inner div `maxWidth: '480px'` → `width: 'min(400px, 100%)'`; outer padding `'32px 16px'` → `clamp(12px, 4vw, 24px)`.
       - `src/screens/learner/FormalAssessmentCompletion.tsx`: `maxWidth: '480px'` → `width: 'min(520px, 100%)'` (keep `margin: '0 auto'`); padding `'32px 16px'` → `clamp(12px, 4vw, 32px)`.
       - `src/screens/learner/practice/ComprehensionActivity.tsx`: all wrapper divs `maxWidth: '600px'` → `width: 'min(640px, 100%)'`; inner content padding `'16px'` → `clamp(12px, 4vw, 24px)`.
       - `src/screens/learner/practice/VocabularyActivity.tsx`: same width change + padding change.
       - `src/screens/learner/practice/ReadAloudActivity.tsx`: same width change + padding change.
       - `src/screens/learner/practice/WordPracticeActivity.tsx`: same width change + padding change.
       Files: all six listed above
       Verify: `npm run build` — zero TS errors.

---

## Final Verification

- [ ] 12. Run `npm run build` from `c:\Users\ashai\TALAS`. Build must exit with code 0, zero TypeScript errors, no unused import warnings.

---

## Key decisions recorded

**Why delete PracticeLobby rather than hide it**: The requirement is that the catalog screen must not exist, not just be hidden. The `practiceActivities` array that powered it is also removed from `practiceData.ts`.

**Why three FEATs**: The data layer (FEAT-001) must exist before the components can compile against the new types; the new/updated components (FEAT-002) must exist before App.tsx can import them (FEAT-003). Each FEAT leaves the codebase in a consistent state when applied together in order.

**ReadAloud score = -1**: Read-aloud is self-assessed (learner reads aloud themselves). Passing `-1` signals "no quantitative score" to PracticeCompletion, which skips the score badge and encouragement text for that activity type.

**handleKeepPracticing reads stale state**: React batches `setPracticeProfile` and `setCurrentScreen` in a single event handler render cycle. When `handleKeepPracticing` is called later (from a different user interaction), the `practiceProfile` closure variable will reference the latest state value because the component has re-rendered. This is safe.

**practice-005, 006, 007 reuse existing content**: For MVP, level-2 and level-3 activities route to the same component implementations as their level-1 counterparts (same passage/items). The IDs are distinct so `getNextPracticeActivity` can differentiate them in `completedActivityIds`.
