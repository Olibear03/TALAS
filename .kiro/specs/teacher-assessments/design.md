# Design Document: Teacher Assessments

## Overview

The Teacher Assessments Feature refactors only `src/pages/teacher/AssessmentsList.tsx` into a locally populated Formal Assessment management view. The existing `/teacher` parent route continues to supply `AppLayout`, including its teacher navigation and content outlet. The page owns typed mock assessment data, selected-filter state, a derived visible-record list, and navigation handlers. It makes no network requests and adds no routes, backend integration, scoring, or review-screen behavior.

## Goals

- Present local Formal Assessment records with learner, class, date, type, assessment status, and separately rendered review status.
- Let teachers view All, Pending Review, or Completed records through accessible filter controls.
- Reuse the existing create route and learner formal-assessment route without router changes.
- Keep the implementation isolated to the existing assessment-list page.

## Non-Goals

- Persisting, fetching, assigning, scoring, or reviewing assessments.
- Changing `AssignAssessment`, `FormalAssessment`, `OralReview`, `SilentReview`, `AppLayout`, or `router.tsx`.
- Introducing backend, database, AWS, authentication, or shared state dependencies.

## Existing Integration

`router.tsx` already declares the required hierarchy:

```text
/teacher (AppLayout)
  /teacher/assessments                         -> AssessmentsList
  /teacher/assessments/new/:learnerId          -> AssignAssessment
  /teacher/learners/:learnerId/formal-assessment -> FormalAssessment
```

No route changes are needed. Because `AssessmentsList` is rendered through the `/teacher` branch, it must render page content only and must not nest or recreate `AppLayout`.

## Architecture

The feature remains a page-local, route-integrated view: immutable local records and the selected filter produce the visible list, while the existing layout and destination routes remain unchanged.

## Components and Interfaces

### Component boundary

| Component/module | Responsibility | Change |
| --- | --- | --- |
| `src/pages/teacher/AssessmentsList.tsx` | Owns local mock data, filter state, derived visible records, page UI, badges, empty state, and navigation handlers. | Modify |
| `src/features/shared/components/AppLayout.tsx` | Continues to render the teacher shell, top navigation, and outlet. | Reuse unchanged |
| `src/pages/teacher/AssignAssessment.tsx` | Receives an existing `learnerId` route parameter for the create flow. | Reuse unchanged |
| `src/pages/teacher/learner/FormalAssessment.tsx` | Receives the selected record's `learnerId` and displays existing formal-assessment history. | Reuse unchanged |
| `src/app/router.tsx` | Supplies the existing destination routes. | Reuse unchanged |

## Data Models

### Page state and derived view

`AssessmentsList` has exactly one UI state value: `activeFilter`. The mock collection is module-level immutable data. The displayed list is computed from that collection and `activeFilter`; it is not duplicated in state.

```ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type AssessmentType = 'Oral' | 'Silent'
type AssessmentStatus = 'Assigned' | 'Submitted' | 'Reviewed'
type ReviewStatus = 'Not started' | 'Awaiting review' | 'Complete'
type AssessmentFilter = 'all' | 'pending-review' | 'completed'

interface AssessmentRecord {
  id: string
  learnerId: string
  learnerName: string
  className: string
  assessmentType: AssessmentType
  assessmentDate: string
  assessmentStatus: AssessmentStatus
  reviewStatus: ReviewStatus
}

const ASSESSMENTS: readonly AssessmentRecord[] = [
  // Mixed Oral/Silent and Assigned/Submitted/Reviewed local examples.
]

function filterAssessments(
  records: readonly AssessmentRecord[],
  filter: AssessmentFilter,
): AssessmentRecord[] {
  switch (filter) {
    case 'pending-review':
      return records.filter(
        ({ assessmentStatus }) =>
          assessmentStatus === 'Assigned' || assessmentStatus === 'Submitted',
      )
    case 'completed':
      return records.filter(({ assessmentStatus }) => assessmentStatus === 'Reviewed')
    case 'all':
    default:
      return [...records]
  }
}

function AssessmentsList() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<AssessmentFilter>('all')
  const visibleAssessments = filterAssessments(ASSESSMENTS, activeFilter)

  // Render the header, filters, accessible table/empty state, and navigation actions.
}
```

The local mock data must include records covering both `Oral` and `Silent`, every assessment-status value, and review-status values that visibly differ from the assessment status. Dates are display-ready local strings because parsing, localization, persistence, and sorting are outside this feature.

## Interfaces and navigation

### Filter interface

A small constant defines the three controls and their labels:

```ts
const FILTERS: readonly { value: AssessmentFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending-review', label: 'Pending Review' },
  { value: 'completed', label: 'Completed' },
]
```

Render these as a single `role="group"` with an explicit label such as `aria-label="Filter assessments"`. Each filter is a semantic `button` using `aria-pressed={activeFilter === value}`. Selecting a button sets `activeFilter`; no request or mutation is performed.

### Create action

The header includes an accessible, visible **Create Formal Assessment** button. The existing create route requires a learner identifier although the page-level action is not attached to a selected record. The page therefore uses a deliberate local demonstration identifier (`DEFAULT_CREATE_LEARNER_ID`) that matches one local mock learner:

```ts
const DEFAULT_CREATE_LEARNER_ID = 'AS-2041'

const openCreateAssessment = () => {
  navigate(`/teacher/assessments/new/${DEFAULT_CREATE_LEARNER_ID}`)
}
```

This reuses `/teacher/assessments/new/:learnerId` and keeps the temporary learner choice explicit until a future assignment-flow design specifies learner selection. It does not create routes or form behavior.

### Record destination

Each table row contains a visible, keyboard-accessible **View formal assessment** button. Its handler derives the destination only from that record:

```ts
const openFormalAssessment = (learnerId: string) => {
  navigate(`/teacher/learners/${learnerId}/formal-assessment`)
}
```

A button inside the row is preferred over making an entire table row clickable, preserving predictable keyboard behavior and avoiding nested interactive controls. It targets the existing learner formal-assessment page and does not introduce a review destination.

## User interface design

### Header

The page renders a page-level `h1` of **Assessments** followed by a concise description identifying the screen as the Formal Assessment management view. The Create Formal Assessment action aligns with the header and wraps cleanly on narrow screens.

### Assessment table

Visible records render in a responsive, horizontally scrollable table container. The table uses a `caption` (visually hidden if desired) describing it as Formal Assessments, a `thead`, scoped column headers, and a `tbody`. Columns are:

1. Learner — learner name with class as supporting text.
2. Type — an Oral or Silent type badge.
3. Assessment date.
4. Assessment status — its own labeled badge.
5. Review status — its own labeled badge.
6. Action — View formal assessment.

The type badge has two distinct visual treatments for Oral and Silent. Assessment status and review status use independent badge helpers/maps and each includes a visually available label (for example, `Assessment: Submitted` and `Review: Awaiting review`). This prevents a color-only distinction and makes the values explicitly separate for sighted users and assistive technology.

```ts
const TYPE_BADGE_CLASS: Record<AssessmentType, string> = {
  Oral: 'bg-coral-50 text-coral-500',
  Silent: 'bg-sky-50 text-sky-500',
}

const ASSESSMENT_STATUS_BADGE_CLASS: Record<AssessmentStatus, string> = {
  Assigned: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-amber-50 text-amber-700',
  Reviewed: 'bg-sprout-50 text-sprout-600',
}

const REVIEW_STATUS_BADGE_CLASS: Record<ReviewStatus, string> = {
  'Not started': 'bg-gray-100 text-gray-700',
  'Awaiting review': 'bg-coral-50 text-coral-600',
  Complete: 'bg-sky-50 text-sky-600',
}
```

### Empty state

If `visibleAssessments.length === 0`, replace the table body/container with a compact status region (`role="status"`) that says no assessments match the active filter. It includes an **Show all assessments** button when the active filter is not `all`; the button resets the filter to `all`. The persistent header and Create Formal Assessment action remain available. Empty state is expected local UI behavior, not an error and not a backend failure.

### Responsive and accessible behavior

- Maintain focusable controls, visible focus styles, sufficient contrast, and 44px action/filter targets where project styling permits.
- Use real buttons for state changes and navigation, not clickable `div`s.
- Keep all table information textual; badges supplement rather than replace type/status text.
- Preserve a sensible reading order: header, create action, filter group, result count/empty message, table, row actions.
- Add an `aria-live="polite"` result summary such as `Showing 2 pending review assessments` so a filter change is announced without moving focus.

## Error Handling

| Condition | Behavior |
| --- | --- |
| No records match the selected filter | Show the accessible empty state; do not render an empty table and do not make a request. |
| No local records are configured | The All view uses the same empty state; Create stays functional through the explicit local default learner identifier. |
| Unknown filter value at a runtime boundary | The exhaustive switch falls back to All, preventing an invalid filter from hiding all records unexpectedly. TypeScript's union prevents this in normal component code. |
| Missing learner data on the destination page | This feature only constructs the documented route from a local non-empty `learnerId`; existing destination behavior remains unchanged. |
| No backend/auth service available | No service is called. The page renders from module-local constants. |

## Testing Strategy

Use Vitest and React Testing Library for page and route behavior. Add property tests only around pure, input-variable logic (`filterAssessments` and route derivation) using the project-compatible property-testing library if already available; otherwise add it as a deliberately pinned dev dependency in the implementation task. Each property test runs at least 100 generated cases and is tagged with the feature/property label below.

| Requirements | Test category | Coverage |
| --- | --- | --- |
| 1.1, 2.2, 5.2, 6.2 | Integration | Render the existing router path, verify AppLayout/nav and both existing route destinations; run representative existing formal-assessment/review regression coverage. |
| 1.2, 2.1, 4.1 | Example | Assert static header copy, the named create action, and all three filter controls. |
| 1.3 | Smoke | Observe render with no network calls and confirm local mock rows are shown. |
| 3.1–3.5 | Property | Generate valid records/visible subsets and verify exactly one fully populated, distinctly labeled row per record. |
| 4.2–4.4 | Property | Generate record arrays and validate exact membership and original order for every filter. |
| 5.1 | Property | Generate valid learner IDs and confirm record selection derives the documented learner formal-assessment URL. |
| 6.1 | Review | Verify implementation changes are confined to `AssessmentsList.tsx` (plus tests/spec artifacts). |

## Correctness Properties

*A property is a characteristic or behavior that holds across all valid executions. These properties connect the requirements to machine-verifiable tests.*

#### Property reflection

The initial analysis identified five property-classified groups. The five individual row-display criteria (3.1–3.5) are inseparable aspects of rendering one record and are consolidated into Property 1; separate properties for type, identity, date, and statuses would duplicate the same row mapping test. The three filter-result criteria (4.2–4.4) are consolidated into Property 2 because one filter function over the full status domain proves all exact subsets and preserves ordering. The navigation criterion (5.1) remains separate because it validates route construction rather than rendering or filtering. No remaining property subsumes the other two.

### Property 1: Visible records render complete, distinct metadata

For any valid collection of Assessment Records and any derived visible subset, the page renders exactly one accessible row per visible record, and every row contains that record's learner name, class, Oral or Silent type, assessment date, and separately labeled assessment-status and review-status values.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

**Test tag:** `Feature: teacher-assessments, Property 1: visible records render complete, distinct metadata`

### Property 2: Review-progress filters select exact records

For any valid ordered collection of Assessment Records, the All filter returns every record in original order, the Pending Review filter returns exactly the Assigned and Submitted records in original order, and the Completed filter returns exactly the Reviewed records in original order.

**Validates: Requirements 4.2, 4.3, 4.4**

**Test tag:** `Feature: teacher-assessments, Property 2: review-progress filters select exact records`

### Property 3: Record selection preserves the learner identifier

For any Assessment Record with a valid learner identifier, activating that record's View formal assessment action navigates to `/teacher/learners/{learnerId}/formal-assessment` using exactly that record's learner identifier.

**Validates: Requirements 5.1**

**Test tag:** `Feature: teacher-assessments, Property 3: record selection preserves the learner identifier`

## Implementation Sequence

1. Replace the current minimal `AssessmentRow` data and cards in `AssessmentsList.tsx` with the typed local record model, mock coverage, filter helper, and filter state.
2. Build the header and Create Formal Assessment action using the existing create route and explicit local learner ID.
3. Add the accessible filter group, live result summary, responsive table, independent type/assessment/review badge helpers, per-row formal-assessment action, and filter empty state.
4. Add focused tests for examples, route integration, smoke behavior, and the three properties; run the existing relevant test suite to protect untouched formal-assessment/review behavior.

## Scope Assurance

The implementation changes only `AssessmentsList.tsx` for production code. `AppLayout`, routing, the creation view, learner formal-assessment view, scoring, and review pages are consumed as existing interfaces and remain unmodified.
