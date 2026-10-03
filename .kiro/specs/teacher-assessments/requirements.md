# Requirements Document

## Introduction

The Teacher Assessments Feature refactors the existing teacher assessments list into a locally populated assessment-management view. The feature retains the existing teacher shell, provides formal-assessment creation and assessment filtering, and directs a selected assessment to the selected learner’s existing formal-assessment page. The scope excludes backend, database, AWS, authentication, assessment scoring, and assessment-review screen work.

## Glossary

- **Teacher Assessments Feature**: The teacher-facing assessment-list experience at `/teacher/assessments`.
- **Teacher Assessments Page**: The rendered page of the Teacher Assessments Feature.
- **AppLayout**: The existing teacher application shell that renders the teacher top navigation and page content area.
- **Formal Assessment**: An assessment record with an Oral or Silent assessment type.
- **Assessment Record**: A Local Mock Data record representing one Formal Assessment for one learner.
- **Local Mock Data**: Assessment Record values defined in the client application for demonstration without an external service.
- **Learner Identifier**: The value that uniquely identifies a learner in a route.
- **Class**: The learner’s instructional group displayed on an Assessment Record.
- **Assessment Status**: The lifecycle value on an Assessment Record: Assigned, Submitted, or Reviewed.
- **Review Status**: The review-state value displayed separately from Assessment Status on an Assessment Record.
- **All Filter**: The filter that includes every local Assessment Record.
- **Pending Review Filter**: The filter that includes Assessment Records with an Assessment Status of Assigned or Submitted.
- **Completed Filter**: The filter that includes Assessment Records with an Assessment Status of Reviewed.
- **Learner Formal-Assessment Page**: The existing learner page at `/teacher/learners/:learnerId/formal-assessment`.
- **Create Formal Assessment Route**: The existing route at `/teacher/assessments/new/:learnerId`.

## Requirements

### Requirement 1: Present the assessment management view

**User Story:** As a teacher, I want a clear assessments page, so that I can view the Formal Assessments for my learners.

#### Acceptance Criteria

1. THE Teacher Assessments Page SHALL render within AppLayout and retain the AppLayout top navigation.
2. THE Teacher Assessments Page SHALL display an assessments title and a description that identifies the page as a Formal Assessment management view.
3. THE Teacher Assessments Page SHALL render Assessment Records from local mock data without requesting a backend, database, AWS, or authentication service.

### Requirement 2: Create a formal assessment

**User Story:** As a teacher, I want a create action, so that I can begin assigning a Formal Assessment to a learner.

#### Acceptance Criteria

1. THE Teacher Assessments Page SHALL display a Create Formal Assessment action.
2. WHEN a teacher activates the Create Formal Assessment action, THE Teacher Assessments Page SHALL navigate to a Create Formal Assessment Route containing a learner identifier.

### Requirement 3: Display assessment records

**User Story:** As a teacher, I want assessment records in a scannable list or table, so that I can identify each learner’s assessment and review state.

#### Acceptance Criteria

1. THE Teacher Assessments Page SHALL display each visible Assessment Record in a list or table.
2. THE Teacher Assessments Page SHALL display the Oral or Silent assessment type for each visible Assessment Record.
3. THE Teacher Assessments Page SHALL display the learner name and class for each visible Assessment Record.
4. THE Teacher Assessments Page SHALL display the assessment date for each visible Assessment Record.
5. THE Teacher Assessments Page SHALL display the Assessment Status and Review Status as distinct values for each visible Assessment Record.

### Requirement 4: Filter assessment records

**User Story:** As a teacher, I want to filter assessment records by review progress, so that I can focus on the records that require attention.

#### Acceptance Criteria

1. THE Teacher Assessments Page SHALL provide an All Filter, a Pending Review Filter, and a Completed Filter.
2. WHEN a teacher selects the All Filter, THE Teacher Assessments Page SHALL display every local Assessment Record.
3. WHEN a teacher selects the Pending Review Filter, THE Teacher Assessments Page SHALL display local Assessment Records with an Assessment Status of Assigned or Submitted.
4. WHEN a teacher selects the Completed Filter, THE Teacher Assessments Page SHALL display local Assessment Records with an Assessment Status of Reviewed.

### Requirement 5: Open learner formal-assessment information

**User Story:** As a teacher, I want to open the selected learner’s formal-assessment information, so that I can review the learner’s existing assessment history.

#### Acceptance Criteria

1. WHEN a teacher selects an Assessment Record, THE Teacher Assessments Page SHALL navigate to the Learner Formal-Assessment Page for the learner identifier on the selected Assessment Record.
2. THE Teacher Assessments Feature SHALL use the Learner Formal-Assessment Page as the selected-assessment destination.

### Requirement 6: Constrain the change scope

**User Story:** As a project maintainer, I want the assessment-list refactor isolated, so that unrelated teacher workflows remain unchanged.

#### Acceptance Criteria

1. THE Teacher Assessments Feature SHALL confine the refactor to the existing Teacher Assessments Page.
2. THE Teacher Assessments Feature SHALL retain the existing Formal Assessment scoring and review screen behavior.
