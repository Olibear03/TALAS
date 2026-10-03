# Implementation Plan: Teacher Assessments

## Overview

Refactor only `src/pages/teacher/AssessmentsList.tsx` into the local Formal Assessment management view specified in the design. Production code remains confined to that component; focused Vitest/React Testing Library coverage may add test files and an exactly pinned property-testing dev dependency only because the design defines universal correctness properties.

## Tasks

- [ ] 1. Build the typed local assessment model and deterministic page behavior in `src/pages/teacher/AssessmentsList.tsx`
  - [ ] 1.1 Replace the current minimal card data with immutable typed Formal Assessment records and pure helpers
    - Define the Oral/Silent type, assessment status, review status, filter union, and complete record shape.
    - Supply local records covering both types, Assigned/Submitted/Reviewed, distinct review values, learner classes, dates, and valid learner IDs; make no network or service calls.
    - Add deterministic helpers for filtering ordered records and constructing the selected learner’s formal-assessment destination, with a safe All fallback for an unknown runtime filter.
    - _Requirements: 1.3, 3.1, 3.2, 3.3, 3.4, 3.5, 4.2, 4.3, 4.4, 5.1, 6.1_

  - [ ] 1.2 Implement the Formal Assessment management header, creation action, and filter state
    - Add the Assessments heading and Formal Assessment management description without recreating `AppLayout`.
    - Replace the existing assign wording with a visible, accessible **Create Formal Assessment** button that uses the explicit local default learner ID and the existing `/teacher/assessments/new/:learnerId` route.
    - Add an accessible All/Pending Review/Completed button group backed by one `activeFilter` state value and a polite live summary of the visible result count.
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.1, 4.2, 4.3, 4.4, 6.1, 6.2_

  - [ ] 1.3 Render the responsive assessment table, distinct badges, row actions, and empty state
    - Render each visible record in a semantically structured, horizontally resilient table with learner/class, type, date, independently labeled assessment/review status, and a keyboard-accessible **View formal assessment** action.
    - Use separate visual/textual treatments for Oral versus Silent and for assessment versus review status; do not use color as the only distinction.
    - Route each row action to `/teacher/learners/:learnerId/formal-assessment`; when no records match, render the described status-region empty state and a Show all assessments reset control while retaining header actions.
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.2, 4.3, 4.4, 5.1, 5.2, 6.1, 6.2_

- [ ] 2. Add focused automated verification for the assessment page
  - [ ]* 2.1 Add a project-compatible property-testing library as an exactly pinned dev dependency, only if one is not already available
    - Keep the change limited to test tooling metadata and use the existing Vitest configuration; do not alter production application configuration.
    - _Requirements: 6.1_

  - [ ]* 2.2 Create focused example, smoke, and route-integration tests for `AssessmentsList`
    - Add `src/pages/teacher/AssessmentsList.test.tsx` using Vitest, React Testing Library, and the existing router setup.
    - Verify the management copy, named creation action, all three accessible filters, local initial rows without network calls, filter interaction/empty-state reset, existing AppLayout navigation, and both documented route destinations.
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 4.1, 5.2, 6.1, 6.2_

  - [ ]* 2.3 Write the property test for complete visible-record metadata
    - **Property 1: Visible records render complete, distinct metadata**
    - Generate valid assessment records and visible subsets; verify exactly one accessible row per record and its learner, class, Oral/Silent type, date, and separately labeled assessment and review values.
    - Tag the test `Feature: teacher-assessments, Property 1: visible records render complete, distinct metadata` and execute at least 100 generated cases.
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

  - [ ]* 2.4 Write the property test for exact review-progress filter membership
    - **Property 2: Review-progress filters select exact records**
    - Generate ordered record collections and verify All, Pending Review, and Completed return precisely the required status subsets in original order.
    - Tag the test `Feature: teacher-assessments, Property 2: review-progress filters select exact records` and execute at least 100 generated cases.
    - **Validates: Requirements 4.2, 4.3, 4.4**

  - [ ]* 2.5 Write the property test for learner-identifier-preserving record navigation
    - **Property 3: Record selection preserves the learner identifier**
    - Generate valid learner identifiers/records and verify a selected record derives exactly `/teacher/learners/{learnerId}/formal-assessment`.
    - Tag the test `Feature: teacher-assessments, Property 3: record selection preserves the learner identifier` and execute at least 100 generated cases.
    - **Validates: Requirements 5.1**

- [ ] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Production implementation is explicitly limited to `src/pages/teacher/AssessmentsList.tsx`; no routing, layout, scoring, review, backend, auth, or shared-state code changes are planned.
- Tasks marked with `*` are optional focused test tasks and can be skipped for a faster MVP.
- Property-test tasks are included because the design contains Correctness Properties. Each property has its own task and tests pure page logic or page rendering without backend integration.
- The existing project scripts support `npm test`, `npm run typecheck:test`, `npm run lint`, and `npm run build` for later validation; this planning workflow does not run or implement them.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3"] },
    { "id": 3, "tasks": ["2.2"] },
    { "id": 4, "tasks": ["2.3"] },
    { "id": 5, "tasks": ["2.4"] },
    { "id": 6, "tasks": ["2.5"] }
  ]
}
```
