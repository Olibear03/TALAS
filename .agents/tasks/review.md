# TALAS Learner-Side UI Implementation

Six new learner screens and supporting infrastructure were added to the TALAS reading assessment PWA: a student-code access gate, a dashboard, an oral assessment prototype with simulated word progression, an oral completion screen, a silent reading assessment with answer-state feedback, and a formal assessment completion screen. Navigation is wired end-to-end in `App.tsx` as a plain `useState` screen machine. Mock data in `mockData.ts` covers the assignment, passage, and all quiz questions. The design system CSS vars, font imports, and utility classes are in place.

**Watch for:** Two props declared in `Props` interfaces (`learnerName` in `OralAssessment` and `SilentAssessment`) are never destructured from the function parameters — with `noUnusedLocals` in play this does not cause a build error (TS only flags unused *local variables* and *function parameters*, not unused object properties on a destructured parameter type), but it is dead surface area that will confuse the next coder. Two interactive elements sit at `minHeight: '44px'`, below the 48 px touch-target floor the product spec and CSS var (`--talas-tap-min: 48px`) both require.

**Verdict**: APPROVED

---

## High-level view

The six screens cover the full required flow without dead ends. Navigation is a closed loop: learner-access → dashboard → oral-assessment → oral-completion → silent-assessment → formal-completion → dashboard, all handled in `App.tsx` with no missing branches.

`mockData.ts` is well-structured: the `QuizQuestion` interface carries `explanation: string`, all four quiz items have a non-empty explanation string, and `mockPassage` is exported as `string[]` with enough paragraphs for the silent assessment to render.

`index.css` satisfies every checklist item: the combined Google Fonts `@import` includes Comfortaa, Plus Jakarta Sans, and Quicksand in a single request; the `:root` block defines all required vars (`--talas-paper`, `--talas-green`, `--talas-yellow` / `--talas-buttercup` alias via `--talas-yellow`, `--talas-blue`, `--talas-charcoal`, `--talas-coral`, `--talas-mint`, `--talas-buttercream`, `--talas-sky`); the `.font-comfortaa` and `.font-jakarta` utility classes are present; and `#root` no longer has a `max-width: 480px` constraint.

The `learnerName` prop is declared in the `Props` interface for both `OralAssessment` and `SilentAssessment` but is omitted from the destructuring pattern in each function signature. TypeScript will not emit a build error for this under the project's `tsconfig.app.json` (the compiler does not track unused *properties* of a destructured object — only top-level variables and parameters), but the prop is dead weight in the type signature and will be passed for no effect.

Two buttons — the "← Bumalik" back button in `OralAssessment` and the "Pakinggan ang Kuwento" listen button in `SilentAssessment` — have `minHeight: '44px'`. The product spec requires ≥ 48 px touch targets, and the design system defines `--talas-tap-min: 48px` for exactly this purpose. These elements are below that floor.

<details>
<summary>Issues (2)</summary>

1. **Dead `learnerName` prop in two screens** — `OralAssessment` and `SilentAssessment` both declare `learnerName: string` in their `Props` interface but neither destructures nor uses it. The prop is passed from `App.tsx`, consumed by neither screen, and invisible to TypeScript's unused-detection (no build error, confirmed). Remove from both interfaces and both `App.tsx` call sites, or destructure and use it (e.g., in a greeting or aria-label). Non-breaking but degrades type-contract clarity.

2. **Sub-48px touch targets on two buttons** — `OralAssessment`'s back button and `SilentAssessment`'s "Pakinggan ang Kuwento" button are set to `minHeight: '44px'` (confirmed by source). The design system var `--talas-tap-min: 48px` exists for this purpose. Change both to `minHeight: 'var(--talas-tap-min)'` or `minHeight: '48px'` to meet the product spec and WCAG 2.5.5.

</details>

<details>
<summary>Details</summary>

### Dead `learnerName` in OralAssessment and SilentAssessment Props

Both `OralAssessment` (`{ onBack, onSubmit }: Props`) and `SilentAssessment` (`{ onComplete }: Props`) declare `learnerName: string` in their respective `Props` interfaces but do not include it in their destructuring patterns. The prop is passed by `App.tsx` in both cases. TypeScript's `noUnusedParameters` flag applies to function-level parameters, not to properties of a destructured object type, so this produces no build error. It is, however, a stale contract: any reader of the interfaces infers the component uses the learner's name, which it does not. The fix is a one-line removal from each interface and the two `App.tsx` call sites — or a genuine use of the name (e.g., an accessible `aria-label` on the passage or a personalised prompt).

### Touch targets below the 48 px floor

The "← Bumalik" back button in `OralAssessment.tsx` and the "Pakinggan ang Kuwento" listen button in `SilentAssessment.tsx` both render at `minHeight: '44px'`. Every other interactive element in the new screens meets or exceeds 48 px. The CSS custom property `--talas-tap-min: 48px` is already defined in `index.css` for exactly this purpose and is unused in these two places.

### Navigation and screen machine correctness

`App.tsx` imports only the six new learner screens — no references to the old `LearnerEntry` or `ReadingLobby` components. The `Screen` union type covers all six states. Every `case` in the `switch` returns a component with the correct prop bindings; there is no missing `default` path that could cause a silent render gap (the `default` branch returns `null`, which is acceptable for an exhaustive union). The flow `learner-access → dashboard → oral-assessment → oral-completion → silent-assessment → formal-completion → dashboard` is complete.

### OralAssessment timer and word-progression effects

The timer `useEffect` runs only when `isRecording` is true and clears its interval on cleanup. The word-advance effect also guards on `isRecording` and clears on cleanup. Both effects depend only on `isRecording`, so they re-register correctly when recording starts and stops. When `activeWordIndex` reaches the last word, the word-advance callback sets `isRecording(false)` and `hasStopped(true)` inside the setter to avoid a stale-closure issue. `showControls` (`isRecording || hasStopped`) gates the four-button control row vs. the "Simulan" button; the state machine is: idle → recording → stopped, with "Ulitin" resetting to idle. No `getUserMedia` call exists anywhere.

### SilentAssessment answer state machine

`handleSelect` is guarded by `if (hasAnswered) return`, preventing re-selection. After selection, the correct answer always turns green (`bg = '#D1FAE5'`, `borderColor = 'var(--talas-green)'`) and a wrong selected answer turns red, regardless of whether the learner chose correctly. The explanation block renders only when `hasAnswered` is true. The Next/Submit button is `disabled={!hasAnswered}` with matching cursor and visual state. The `questionSeconds` timer resets when `currentQuestionIndex` changes via the `useEffect` dependency. The progress bar advances by one question once the current question is answered (`progressFill` uses `hasAnswered ? 1 : 0` as a partial credit).

### mockData completeness

`QuizQuestion` interface declares `explanation: string` (not optional). All four `mockQuiz` entries include an `explanation` value (confirmed). `mockPassage` has four paragraphs; `SilentAssessment` renders `[0]` and conditionally `[1]`, ignoring `[2]` and `[3]` — acceptable for a prototype. `mockAssignment` provides `title`, `level`, and `estimatedMinutes`, all consumed by `FormalAssessmentCompletion`.

### CSS variables and font import

All variables referenced by the new screens are defined in `:root`: `--talas-paper`, `--talas-green`, `--talas-yellow`, `--talas-blue`, `--talas-charcoal`, `--talas-coral`, `--talas-mint`, `--talas-buttercream`, `--talas-sky`. The Google Fonts `@import` is a single combined URL loading Comfortaa (400, 700), Plus Jakarta Sans (400, 500, 600, 700), and Quicksand (400, 600, 700). `.font-comfortaa` and `.font-jakarta` utility classes are present. `#root` now sets `width: 100%` and `min-height: 100svh` with no `max-width`.

</details>

---

<details>
<summary>File map</summary>

| File | What changed |
|---|---|
| `src/App.tsx` | Replaced with six-screen learner state machine; removed all old screen imports |
| `src/index.css` | Added combined Google Fonts import, CSS vars, utility classes; removed `#root max-width` |
| `src/data/mockData.ts` | Added `Assignment`, `QuizQuestion` interfaces and all mock exports |
| `src/screens/learner/LearnerAccess.tsx` | New: student-code entry screen |
| `src/screens/learner/LearnerDashboard.tsx` | New: main learner home with assigned work and practice cards |
| `src/screens/learner/OralAssessment.tsx` | New: oral reading with simulated word highlighting and recording controls |
| `src/screens/learner/OralCompletion.tsx` | New: post-oral encouragement screen |
| `src/screens/learner/SilentAssessment.tsx` | New: two-column silent reading with MCQ answer feedback |
| `src/screens/learner/FormalAssessmentCompletion.tsx` | New: assessment completion with frog mascot celebration |

</details>
