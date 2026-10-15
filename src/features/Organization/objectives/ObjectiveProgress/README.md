# Objectives Progress Management

## Document status

This document describes the Objective Progress workflow and its integration in the `objective-progress` branch.

The [reference application](https://hse-client-preview.ibrahimelrefaey2019.chatgpt.site/#objectives) is a functional reference only. Its client-side behavior is not a backend contract. The existing HSE Objectives form and application theme are the visual reference.

## Implemented frontend and integration boundary

The Index actions include **View**, using the existing DropList RouterLink behavior and permissions. Edit/Delete remain available. Progress history, create, details, and correction use the same Params → API Service → Repository → Use Case → Controller structure as the Objectives feature.

### Pages and routes

| Component                                                                          | Route under `/organization`                          |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [ObjectiveDetails.vue](Presentation/components/ObjectiveDetails.vue)               | `/objectives/:objectiveId/details`                   |
| [UpdateObjectiveProgress.vue](Presentation/components/UpdateObjectiveProgress.vue) | `/objectives/:objectiveId/progress/update`           |
| Same form in correction mode                                                       | `/objectives/:objectiveId/progress/:progressId/edit` |

Supporting components: [ObjectiveInformation.vue](Presentation/components/ObjectiveInformation.vue), [ObjectiveProgressHistory.vue](Presentation/components/ObjectiveProgressHistory.vue), and [ObjectiveProgressIndicator.vue](Presentation/components/ObjectiveProgressIndicator.vue). The existing `/objectives/:id` Edit route is preserved.

### File inventory

Created inside this module: this README; four params in `Core/params`; shared calculations, periods and validation in `Core/utils/objectiveProgress.ts`; three models in `Data/models`; contract and service in `Data/apiServices`; repository in `Domain/repositories`; four use cases in `Domain/useCase`; four controllers, one composable, six components and shared CSS in `Presentation`.

Created outside this module: `scripts/objective-progress.spec.ts`, `scripts/objective-progress-browser.spec.ts`, and `scripts/objective-progress.config.ts`.

Modified existing files: Objectives index/details models, `IndexObjectives.vue`, `showObjectivesController.ts`, `src/router/routes/organization/objectives.ts`, and `src/locales/en.json` / `ar.json`.

### Verification and limitations

The production build passes. Targeted ESLint passes. Repository-wide type checking retains the same 2,993 distinct normalized pre-existing diagnostics, with no new diagnostics; repository-wide ESLint reports 4,767 errors and 1,108 warnings, versus 4,770 errors and 1,108 warnings before this change. These unrelated failures were not suppressed.

Browser tests use explicitly intercepted test-only APIs to exercise successful create/correction, refreshed history/index, errors, permissions, direct routing, and English/Arabic responsive layouts. They verify frontend behavior, not the existence of a backend contract. Utility tests cover calculations, all reporting frequencies, future dates, year boundaries, leap years, numeric validation and duplicate policies. Run with `npx playwright test --config scripts/objective-progress.config.ts` while the development server runs at `http://127.0.0.1:5187` (or set `OBJECTIVE_TEST_URL`).

Real progress persistence, attachment persistence, correction audit integration, and live index summary mapping remain blocked by the contract checklist below. Export is not implemented and no nonfunctional Export button is displayed.

## Workflow

1. Open Objectives Index.
2. Select **View** for an objective.
3. Review the objective configuration, latest reported result, attainment indicator, and progress history.
4. Select **Update Progress**.
5. Select an eligible reporting period belonging to the objective's configured year.
6. Enter an actual result, optional notes, and supported attachments.
7. Validate and submit through the confirmed API.
8. After a successful response, return to Objective Details and fetch fresh objective details and progress history.
9. Returning to Objectives Index must fetch fresh data so its latest result and indicator are synchronized.

A failed request must preserve the form, display the error, and allow retry. It must not show a success notification, create a local progress record, or navigate away.

## Existing architecture

The Objectives feature uses:

```text
Core/params
Data/models
Data/apiServices
Domain/repositories
Domain/useCase
Presentation/controllers
Presentation/components
```

The call chain is:

```text
Component → Controller → UseCase → Repository → ApiService
                                              ↑
                                       typed Params
```

Existing base abstractions:

- `Params` with `toMap()`.
- `ServicesInterface` and `CrudType`, using the existing authenticated network service.
- `RepoInterface<T>`, which maps response data and returns `DataState<T>`.
- `UseCase<T, Params>`.
- `ControllerInterface<T>` / `SelectControllerInterface<T>`.
- `DataStatusBuilder`, `TableLoader`, `DataEmpty`, and `DataFailed`.
- `PermissionBuilder` / `PermissionHandler` with existing objective permissions.
- `DialogSelector` for success/failure notifications.
- Existing pagination, search, table, input, upload, and routing components.

Keep `ObjectiveProgress` nested inside `objectives`. Follow the existing `Domain/repositories` and `Domain/useCase` directories rather than introducing a second architecture under `Core/useCases`.

### Proposed responsibilities

```text
ObjectiveProgress/
├── README.md
├── Core/
│   ├── params/               # history, details, create, correction requests
│   └── utils/                # reporting periods, calculations, validation
├── Data/
│   ├── models/               # progress records, attachments, history
│   └── apiServices/          # confirmed endpoint and wire-contract mapping
├── Domain/
│   ├── repositories/
│   └── useCase/
└── Presentation/
    ├── controllers/
    ├── components/           # details, history, update form, indicator
    ├── composables/          # shared loading/form orchestration if needed
    └── styles/               # feature-scoped existing HSE theme
```

This tree describes responsibilities, not a requirement to create empty or redundant files. List and details can share a progress-record model if their normalized fields are identical.

## Verified existing endpoints

The existing API constants and Objectives documentation specify the following relative endpoint names. The network configuration supplies the environment-specific API prefix.

| Operation            | Existing request method | Endpoint                          | Known identifier      |
| -------------------- | ----------------------- | --------------------------------- | --------------------- |
| List objectives      | POST                    | `fetch_objectives`                | Optional `project_id` |
| Objective details    | POST FormData           | `fetch_objectives_details`        | `objective_id`        |
| Create objective     | POST                    | `create_objectives`               | Not applicable        |
| Edit objective       | POST                    | `update_objectives`               | `objective_id`        |
| Delete objective     | POST FormData           | `delete_objectives`               | `objective_id`        |
| Change active status | POST FormData           | `change_objectives_active_status` | `objective_id`        |

Do not use the objective update endpoint to report progress unless the backend explicitly documents that behavior.

### Progress endpoints

| Operation        | Request method | Endpoint                           |
| ---------------- | -------------- | ---------------------------------- |
| Progress history | POST           | `fetch_objective_progress`         |
| Progress details | POST FormData  | `fetch_objective_progress_details` |
| Create progress  | POST JSON      | `create_objective_progress`        |
| Edit progress    | POST JSON      | `update_objective_progress`        |

The request params use `objective_id`, `objective_progress_id`, `period`, `actual_result`, `notes`, `attachments`, and `retained_attachment_ids` as applicable. New attachments are sent as base64 data URL strings in the JSON `attachments` array.

## Existing objective model

The existing details model exposes:

| Property            | Meaning / notes                                                                        |
| ------------------- | -------------------------------------------------------------------------------------- |
| `id`                | Existing backend identifier; use as the objective number if no separate number exists. |
| `year`              | Reporting year; do not replace it with the current year.                               |
| `objective`         | Objective text.                                                                        |
| `project`           | Nullable project; display translated “Company-wide” when null.                         |
| `targetType`        | Existing target-type enum.                                                             |
| `direction`         | Existing increase/reduce enum, nullable for periodic targets.                          |
| `department`        | One nullable department is documented; multiple departments are not confirmed.         |
| `followUpEmployee`  | Nullable follow-up employee.                                                           |
| `target`            | Saved target; number-reduction semantics need confirmation.                            |
| `baseline`          | Baseline used for reduction calculations.                                              |
| `unit`              | Configured measurement unit.                                                           |
| `frequency`         | Periodic reporting frequency.                                                          |
| `annualOccurrences` | Saved annual planned occurrence count.                                                 |

The index model currently contains `id`, `year`, `objective`, `projectTitle`, `targetType`, `direction`, `target`, `frequency`, and translated-title fields. It does not document latest progress, attainment, department, employee, baseline, or unit summaries.

Do not manufacture those index values. Prefer a confirmed expanded index response or batch summary endpoint over one history/detail request per row.

Status and a separate objective number are not documented fields. Show them only when supported by a verified response.

## Screens

### Objectives Index

Required columns:

1. Objective No.
2. Objective.
3. Project.
4. Target Type.
5. Target, including the correct unit.
6. Responsible Departments, according to the supported response.
7. Follow-up Responsible.
8. Latest Actual Result.
9. Attainment indicator: numeric percentage and horizontal bar.
10. Latest Progress Period.
11. Actions.

Preserve existing search, pagination, edit/delete actions, and permissions. Preserve year/direction information in the row or existing columns where appropriate. Add View using Vue Router. Unknown progress values must show an unavailable marker, not zero.

### Objective Details

Use a header with identifier, objective text, optional backend status, Back, and Update Progress. Export should be omitted unless implemented using a supported export mechanism.

Use a responsive information grid for the saved objective fields, latest actual result, attainment, and latest reporting period. Show baseline/unit/frequency only when relevant. Never render literal `null` or `undefined`.

A Progress History section is mandatory, including loading, unavailable, error/retry, empty, and populated states.

### Progress History

Display period, actual result with unit, recorded employee, recorded date/time, notes, attachments, and corrections/actions.

Use a predictable chronological order based on normalized reporting-period dates and record timestamps/IDs. The backend must identify the authoritative result when multiple records or corrections exist for one period. Do not assume the latest submission is necessarily the latest reporting period.

Preserve notes whitespace. Support long text and horizontal table scrolling. Render only supplied correction/audit information. Do not generate audit records on the frontend.

Validate attachment URLs before rendering links; do not render `javascript:` or similar executable URLs. Preview supported images and provide downloadable links for other supported files.

### Update Progress

Load the objective by route ID. Do not allow changes to the saved target configuration.

Fields:

- Read-only objective summary.
- Eligible reporting-period selector.
- Target-dependent actual result input.
- Optional notes.
- Optional supported attachments, with removal before submission.
- Save Progress and Cancel/Back.

In correction mode, load the progress record by its original ID, retain existing attachment identities, and preserve backend audit metadata. Do not enable correction without a confirmed update endpoint and correction rules.

## Enums and reporting periods

Reuse `Core/enums/objectivesEnums.ts` and its existing title helpers. Do not duplicate enum definitions.

| Target type       | Value | Default schedule                                 |
| ----------------- | ----- | ------------------------------------------------ |
| Percentage        | `1`   | Monthly, unless the backend specifies otherwise. |
| Number            | `2`   | Monthly, unless the backend specifies otherwise. |
| PeriodicFrequency | `3`   | The saved `frequency`.                           |

| Frequency    | Value | Periods for objective year Y |
| ------------ | ----- | ---------------------------- |
| Annually     | `1`   | Year Y                       |
| SemiAnnually | `2`   | H1 Y, H2 Y                   |
| Quarterly    | `4`   | Q1 Y through Q4 Y            |
| Monthly      | `12`  | January Y through December Y |

Generate machine-readable period identities, translated labels, start dates, and end dates in one reusable utility. Machine identities such as `2026-09` are application representations until the backend payload format is confirmed.

Default availability policy, unless the backend specifies otherwise: a period becomes available when its **start date** is reached. The current ongoing period is allowed; later periods are disabled. Compare real dates, not labels. The same validation must run before submission.

Use the objective year. Handle leap years, year boundaries, unsupported frequencies, and invalid years. Confirm the reporting timezone if it differs from the user's local calendar.

## Actual result and calculations

Raw actual result and achievement percentage are different values. Store the reported result; calculate attainment separately or use a verified backend indicator.

### Percentage increase

```text
achievement = actual / target × 100
```

Example: target 80%, actual 64% → achievement 80%.

Input: cumulative actual result (%), finite non-negative number with decimal support.

### Number increase

```text
achievement = actual / target × 100
```

Example: target 200 suppliers, actual 126 suppliers → achievement 63%.

Input: cumulative actual result with the saved unit and suitable decimal precision.

### Percentage reduction

The existing Objectives form explicitly describes the percentage target as the **required reduction from baseline**:

> Enter the reduction required: 20 means reduce the baseline by 20%.

If the progress contract confirms that actual result is the current measured value in the baseline unit:

```text
actual reduction percentage = (baseline − current actual) / baseline × 100
achievement = actual reduction percentage / target reduction percentage × 100
```

Example: baseline 100, target reduction 30%, current actual 80 → achievement approximately 66.67%.

The actual input must be labelled as the current measured value with its unit, not as an already-calculated achievement percentage. Confirm the progress input semantics before enabling writes.

### Number reduction — unresolved semantics

The current form and documentation do not conclusively distinguish these alternatives:

| Meaning of target         | Formula                                           |
| ------------------------- | ------------------------------------------------- |
| Required reduction amount | `(baseline − actual) / target × 100`              |
| Desired final value       | `(baseline − actual) / (baseline − target) × 100` |

Do not choose between them without confirmation. Keep raw actual visible; prefer a verified backend indicator. Otherwise display an unavailable indicator with a translated explanation.

### Periodic frequency

For confirmed cumulative annual results:

```text
achievement = cumulative completed occurrences / annual planned occurrences × 100
```

Use saved `annualOccurrences` when present; otherwise use the supported annual frequency count. For example, 7 of 12 monthly occurrences is approximately 58.33%.

The backend must confirm whether a progress record is a cumulative annual total or a count within the reporting period. Never silently interpret period-specific counts as cumulative totals or sum corrections twice. If values are period-specific, use a verified aggregation rule or backend attainment summary.

### Calculation safeguards

- Missing actual, target, required baseline, or a zero/invalid denominator → unavailable, not fabricated zero.
- Reject non-finite actual inputs and unsupported negative inputs.
- Allow decimal values for percentage and number targets.
- Occurrence counts must be non-negative integers.
- Preserve numerical overachievement above 100%.
- Clamp only the visual bar to 0–100%; keep the numeric value truthful.
- A negative calculated reduction attainment can describe worsening performance; do not confuse it with a negative submitted actual value.
- Share one tested calculation utility across index, details, and history summaries.

## Validation and submission

Validate:

- Positive, safe integer objective and progress IDs where required.
- Objective exists and matches the requested route.
- Period is selected, belongs to the objective year/schedule, and has started.
- Actual result is present, finite, and non-negative unless explicitly allowed by contract.
- Periodic occurrence count is an integer.
- Attachment count, size, and types match confirmed backend limits.
- Duplicate-period behavior follows the confirmed backend policy.
- Correction fields follow backend immutability rules.

If only one record per period is permitted, prevent accidental duplicate creation and offer correction only when supported. The backend must also enforce uniqueness to handle concurrent clients.

Do not universally reject decreases: reduction objectives, corrections, and some measurement policies legitimately produce them.

Prevent concurrent submissions while saving. On failure retain form values and attachments. On success use the existing notification infrastructure, navigate using Vue Router, and refresh history and objective summary without `window.location` or a browser reload.

## Attachments

Existing organization features use differing attachment mechanisms. A shared `FileUpload.vue` emits `File`/`File[]`, while some API params accept uploaded string references. Neither establishes the Objective Progress upload contract.

Confirm:

- Whether uploads are embedded in create/edit or use a separate endpoint.
- Multipart field names or uploaded attachment identifiers.
- Single or multiple files, accepted types, maximum size/count.
- How retained and removed attachments are represented during correction.
- Whether attachment URLs are public, authenticated, or expiring.
- Whether image MIME types and original names are returned.

For multipart requests, use the existing FormData/network flow and let the browser provide the multipart boundary. The shared header helper defaults to JSON, so that header must not be carried into a multipart request.

Do not claim upload success if upload or progress submission fails. Unknown attachment support must remain explicitly unavailable.

## Routing and permissions

Existing routes must remain intact:

| Path                           | Current purpose  |
| ------------------------------ | ---------------- |
| `/organization/objectives`     | Index            |
| `/organization/objectives/add` | Create objective |
| `/organization/objectives/:id` | Edit objective   |

Proposed non-conflicting additions:

| Path                                                              | Suggested name                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------------ |
| `/organization/objectives/:objectiveId/details`                   | `organization-objectives-details`                            |
| `/organization/objectives/:objectiveId/progress/update`           | `organization-objectives-update-progress`                    |
| `/organization/objectives/:objectiveId/progress/:progressId/edit` | `organization-objectives-edit-progress`, only when supported |

Use route parameters so direct navigation and refresh work. Handle invalid IDs, deleted objectives, forbidden responses, and network errors. Preserve breadcrumbs and named Back navigation.

Reuse existing objective permissions for viewing and updating unless the backend defines separate progress permissions. Confirm permissions before exposing write operations; backend authorization remains required.

## Visual identity and localization

Match the existing Objectives form and theme, including:

- `--PrimaryColor`, `--surface-1`, `--surface-2`.
- `--text-strong`, `--text-soft`, `--main-border`.
- Existing fonts, form controls, button conventions, card radii, and shadows.
- Scoped feature styles, responsive information grids, and horizontally scrollable tables.
- English and Arabic translation keys, logical spacing, RTL/LTR, and translated enum titles.
- Semantic labels, keyboard navigation, visible focus, loading states, inline validation, and accessible disabled controls.

Do not import a separate theme from the reference application or add unsupported UI actions.

## Verification plan

Use the project's existing Playwright/TypeScript tooling without new dependencies. Tests may use clearly identified fixtures; production must never substitute fixtures for API data.

### Calculation and period tests

1. Percentage increase.
2. Number increase.
3. Percentage reduction with baseline and confirmed current-value semantics.
4. Both explicit number-reduction interpretations; unavailable when unspecified.
5. Annual periodic attainment.
6. Semiannual periodic attainment.
7. Quarterly periodic attainment.
8. Monthly periodic attainment.
9. Future-period rejection, including manipulated form state.
10. Past objective years.
11. Future objective years.
12. Year boundaries and start-date availability.
13. Leap-year February end date.
14. Division by zero.
15. Null/undefined/non-finite results.
16. Overachievement without numeric capping.
17. Integer occurrence validation.
18. Single-record duplicate prevention and permitted multiple-record behavior.

### Workflow tests

- Index View navigation and unchanged Edit/Delete links.
- Direct details/update access and refresh.
- Invalid/missing/forbidden objective responses.
- History loading, empty, unavailable, failure/retry, and correction rendering.
- Save failure retains input and does not navigate or fabricate success.
- Successful save refreshes details/history and the returning index.
- Duplicate-submit protection.
- Attachment failure, retained attachments, removal, and URL safety.
- Arabic translations, RTL, keyboard interaction, mobile/tablet/desktop layouts.

### Repository commands

The existing `package.json` defines:

```sh
npm run type-check
npm run lint -- --no-fix
npm run build
npx playwright test <focused-test-files>
```

`lint` includes `--fix` in its definition; the additional `--no-fix` avoids changing unrelated files during validation. Compare failures with the pre-change baseline and fix only issues introduced by the feature.

Before implementation and final delivery:

```sh
git branch --show-current
git status --short
```

The required branch is `objective-progress`. Do not commit, push, create another branch, stash, or overwrite user changes automatically.

## Backend confirmation checklist

| Contract item                                      | Current status                                                          |
| -------------------------------------------------- | ----------------------------------------------------------------------- |
| Objective CRUD endpoints and known fields          | Documented in repository                                                |
| Progress history URL/method/schema/pagination      | Client integration configured                                           |
| Progress detail URL/method/schema                  | Client integration configured                                           |
| Create progress URL/method/payload/response        | Client integration configured                                           |
| Correction URL/method/payload/immutability rules   | Client integration configured                                           |
| Index latest-progress/attainment summary fields    | Missing                                                                 |
| Reporting-period wire representation               | Missing                                                                 |
| Cumulative versus period-specific result semantics | Configured as cumulative                                                |
| One versus multiple records per period             | Configured as one record per period                                     |
| Number-reduction target meaning                    | Ambiguous                                                               |
| Percentage-reduction target meaning                | Described by existing form; progress actual semantics still unconfirmed |
| Attachment upload and correction contract          | Multipart integration configured                                        |
| Progress-specific permissions                      | Missing                                                                 |
| Correction audit schema                            | Missing                                                                 |
| Authoritative latest record/aggregation rule       | Missing                                                                 |

The endpoint names and payload fields must match the deployed backend for end-to-end requests to succeed.
