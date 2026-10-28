# Organization analytics backend implementation contract

Implement tenant-scoped CAPA and internal-audit aggregates first, with exact record drilldown and explicit metric definitions. Extend the same read contract to operations, workforce evidence, PPE, inductions, objectives and configuration completeness. The [frontend plan](organization-analytics-frontend.md) maps every supplied sidebar route to a chart or statistics opportunity.

All `fetch_analytics_*` endpoints below are **proposed new endpoints**, not existing routes verified on the production server. This repository contains the Vue frontend, not the backend/database schema. Logical facts below must be mapped to the server's real tables and policies. JSON examples are synthetic contract examples, not production figures.

Review target: `https://sys.hse.techlabeg.com/organization`, 2026-10-28. Existing field names and wire formats are supported by client code and the live read review summarized in the frontend appendix. Preserve current transactional APIs while introducing analytics; do not turn paginated register responses into an undocumented analytics API.

## Existing contracts and specific gaps

All paths in this table are existing API-name strings relative to the configured authenticated organization API prefix. A live HTTP 200 confirms a read response, not a complete analytics definition or historical ledger.

| Module                     | Existing read source                                                                                                                                                                                               | Known operational facts                                                                                                                               | Analytics work still required                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Home                       | `fetch_home_inspection_and_observations_statices`, `fetch_home_observation_types_with_zones_statices`, `fetch_home_equipments_statices`                                                                            | Current summary counts, zone report components and ownership/category counts                                                                          | Field-level authorization, date basis, deduplication, exact scope, historical series and drilldown.                     |
| Projects                   | `fetch_projects`, project details/summary services in `apiNames.ts`                                                                                                                                                | Lifecycle/setup, scope, assignment counts, operations, meetings/drills and loss-time rollups                                                          | Distinct entities vs assignments, date-scoped operations, authoritative project comparison.                             |
| Equipment                  | `fetch_equipments`, `fetch_equipment_types`, detail services                                                                                                                                                       | Type, rental/owned state, warehouse, service flag, project/zone, rental dates and evidence                                                            | Unique asset snapshot, assurance/expiry rules and historic assignment validity.                                         |
| Incidents and observations | `fetch_observations` with the module's type/filter parameters                                                                                                                                                      | Source type, date, project/location/zone, risk, near miss, people/injury and linked follow-up                                                         | Explicit source taxonomy, occurrence date, classification and deduplication.                                            |
| Inspections                | `fetch_tasks`, task/result/period services                                                                                                                                                                         | Definitions/schedules, occurrences/results/assignees represented in different models                                                                  | Occurrence-grain eligibility, due/completed timestamps, cancellations, extensions and result-to-occurrence mapping.     |
| Investigations             | `fetch_investigations`, detail/result services                                                                                                                                                                     | Source report, states, team/leader, meetings/results, tasks and root causes                                                                           | Canonical states, event dates, aging and completion/result semantics.                                                   |
| CAPA                       | `fetch_capas`, `fetch_capa_details`, task-result and verification services                                                                                                                                         | Mixed source cases, corrective/preventive tasks, due date, owner, status, evidence and verification                                                   | Canonical case/task identities, distinct task rollups, due-date history, completion/reopen events and assessment grain. |
| Internal audit             | `fetch_internal_audits`, `fetch_internal_audit_details`, `fetch_internal_audit_plan_details`, `fetch_internal_audit_attendance`, `fetch_ncrs`, `fetch_ncr_details`, `fetch_internal_audit_report_details`          | Plan dates/state, company-wide/project scope, standards, roster, opening/closing attendance, NCR category/status/due date, reports and linked actions | Distinct plan/NCR/task rollups; schedule/report/closure history; roster denominator; canonical source links.            |
| Personal audit             | `fetch_my_internal_audite`, `fetch_my_ncrs`                                                                                                                                                                        | Current-person plan/NCR assignment views                                                                                                              | Explicit server-side personal scope and due-work aggregates; organization counts cannot be inferred from these lists.   |
| Inductions                 | `fetch_induction`, `fetch_induction_detail`                                                                                                                                                                        | Session/date, instructor, topics, project/location/zone and attendees                                                                                 | Unique attendance facts, eligibility/required population, topic validity and history.                                   |
| PPE                        | `fetch_ppe_active_tool_matrix`, `fetch_ppe_matrix_delivery`, `fetch_ppe_activities`, `fetch_ppe_tools`                                                                                                             | Required activity/tool matrix and dated employee/activity/tool delivery flags                                                                         | Effective requirements, eligible assignments, issue/return/replacement rules; quantities if a quantity chart is wanted. |
| Objectives                 | `fetch_objectives`, details, `fetch_objective_progress`, progress details                                                                                                                                          | Target type/direction/baseline/unit, reporting periods, actual/indicator and corrections                                                              | Effective cumulative reading, planned reporting periods, explicit reduction rule and historical snapshots.              |
| Workforce and requirements | `fetch_organization_employees`, `fetch_herikalys`, `fetch_organization_employees_certificates`, `fetch_certificates`                                                                                               | Status, positions, assignments, requirement definitions and valid/invalid/expired/not-required cells                                                  | Requirement resolution, distinct employee/requirement combinations, effective expiry and completeness.                  |
| Organization assurance     | `fetch_organization_certificate`, `fetch_documents`, `fetch_contractors`, `fetch_document_references`                                                                                                              | Issued organization certificates, controlled document review dates, contract expiry and master references                                             | Required evidence population, no-expiry rules, effective versions and review/expiry worklists.                          |
| Configuration              | `fetch_templates`, `fetch_roles`, `fetch_notification_plans`, `fetch_attachment_matrix`, `fetch_scopes`, `fetch_warehouses`, `fetch_coding_systems`, `fetch_factories`, `fetch_factory_items`, `fetch_work_shifts` | Definitions, memberships/mappings, active flags, attachment groups and scheduled shifts                                                               | Transaction joins for usage/completeness; no delivery, stock-movement, timesheet or safety-performance assumptions.     |

The live CAPA list can return NCR-shaped rows with `internal_audit_id`, `ncrs_category`, `tasks` and nested `capa`; its row `id` is not automatically a CAPA task ID. Live audit registers use a paginated envelope and include `ncrs_count`, `open_ncrs_count`, `closed_ncrs_count`; personal-audit responses can leave those fields null. A null count must not become zero.

## Measurement and aggregation rules

### Entity grains

| Fact                          | Canonical key                                                         | Rules                                                                                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CAPA case                     | Stable server-issued case UID                                         | Link to observation/hazard/incident, investigation or NCR without confusing source IDs. A case is not an action task.                                                    |
| CAPA action task              | Stable task UID or `(task_source, task_id)`                           | Task source distinguishes investigation, NCR and other implementations. A task visible through two source joins is counted once. Corrective/preventive type is explicit. |
| Verification                  | Assessment UID and task/case scope                                    | Expose latest effective assessment for snapshot outcomes; keep all events for history. Never sum task-level and parent-level assessments as one population.              |
| Audit plan                    | Audit plan ID                                                         | A company-wide plan linked to several projects remains one plan. Multi-standard associations must not multiply totals.                                                   |
| NCR                           | NCR ID                                                                | Status/category belong to the NCR. Linked corrective/preventive tasks are separate facts.                                                                                |
| Inspection occurrence         | Schedule ID + occurrence ID                                           | Separate scheduled definition, eligible due occurrence, task, submitted result and result-item.                                                                          |
| Employee evidence requirement | Employee + requirement + effective assignment                         | De-duplicate overlapping position requirements and multiple uploaded renewals. Store the effective evidence record separately.                                           |
| PPE requirement               | Employee + assignment/activity + tool + effective requirement version | Delivery facts satisfy requirements under explicit issue/return/replacement rules. Count physical quantities only if stored.                                             |
| Induction participation       | Session + attendee                                                    | Session-topic joins must not multiply attendee/session participation counts. Unique attendees and total participations are different metrics.                            |
| Objective effective progress  | Objective + reporting period                                          | Corrections replace the effective period record. Cumulative readings are not additive between periods.                                                                   |
| Equipment/project/workforce   | Asset ID / project ID / employee ID                                   | Assignment rows are a different grain; a cross-project headcount or asset total is a distinct union.                                                                     |
| Evidence/document/contract    | Stable resource ID and effective version                              | A renewed file/version does not create two current certificates or two current documents.                                                                                |

Prefer `COUNT(DISTINCT canonical_uid)` or an equally correct pre-aggregated fact grain. Pre-aggregate one-to-many joins before combining standards, attachments, owners, participants and actions.

### Time and scope

- Resolve the organization from authentication. All project, location, zone, owner, contractor, audit and requirement filters must belong to that tenant and be visible to the caller.
- Dates in requests are ISO calendar dates; timezone is an IANA name, normally the organization's business timezone. Convert inclusive local `from_date`/`to_date` to a UTC half-open interval `[local start, local day after to_date)`; do not hard-code a UTC offset.
- `as_of` defaults to server now. Current backlog includes eligible records created before `as_of`, including older open work. It is not restricted to records created during the chart's selected flow period.
- Flows use their named event date: created, occurred, completed, report submitted, delivery or effective reporting period. Do not use `updated_at` as a substitute for completion or verification.
- Historical backlog/status/overdue requests need state and due-date history. Return `unavailable` with `historical_state_not_available` if reconstruction is impossible; never relabel today's status by creation month.
- Future event buckets are not actual zero performance. Distinguish forecast/planned counts from realized counts. Empty **complete** past buckets are zero; unknown or incomplete buckets are null.
- Snapshot comparisons need reconstructable prior snapshots. Flow comparisons need equal definitions, scope, duration and timezone. A change from a previous zero has no finite relative percentage; expose the absolute change and null relative change.
- Organization-only resources must reject unsupported project filters or declare an explicit organization-wide scope. No silent filter removal.
- Company-wide audit inclusion under a selected project is explicit (`include_company_wide`). De-duplicate company-wide plans/NCRs when comparing multiple projects. Per-project rows may overlap and must advertise that they are non-additive.

### Values, completeness and ratios

Return finite nonnegative counts, not empty strings or formatted display text. `0` means a measured zero. Unknown counts are null. Each metric declares unit, date basis, availability, definition version and coverage.

A ratio includes numerator and denominator. Zero/unknown denominator produces a null ratio with a reason. Percent is expressed on a 0–100 scale; rates and raw fractions use different units. Do not return the string `"80%"`.

Partial metrics must identify what was measured and missing. Prefer a null total plus `known_count` when only a lower bound is established; the UI may display “at least N” with coverage. Do not call a partial known count an exact total.

Group-by responses specify whether buckets partition the population. Exclusive status/category buckets, including `unknown`, can reconcile to a total; multi-owner/multi-standard/multi-scope buckets can overlap and must not be summed. `other` and `unassigned` are different buckets. Top-N truncation includes `other_count` or pagination plus `has_more`.

## CAPA first-delivery definitions

Source evidence: [case model](../../src/features/Organization/Capa/Data/models/IndexCapaModel.ts), [details model](../../src/features/Organization/Capa/Data/models/ShowCapaDetailsModel.ts), [task model](../../src/features/Organization/Capa/Data/models/CapaTasksModel.ts), [details request](../../src/features/Organization/Capa/Core/params/ShowCapaDetailsParams.ts), [task states](../../src/features/Organization/Capa/Core/Core/InvestegationTaskEnum.ts), [verification states](../../src/features/Organization/Capa/Core/Core/VerificationEnum.ts).

### Existing state mappings and normalization

| Existing value                      | Client meaning                           | Analytics treatment                                                                                                                                                                                                                                |
| ----------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Task 0 or 1                         | Not started                              | Normalize to `not_started`; do not count 0 and 1 as separate phases.                                                                                                                                                                               |
| Task 2                              | In progress                              | `in_progress`.                                                                                                                                                                                                                                     |
| Task 3                              | Pending / on hold                        | `on_hold`; it remains unfinished unless the domain has an explicit exclusion rule.                                                                                                                                                                 |
| Task 4                              | Overdue                                  | This legacy value mixes lifecycle and a due-date flag. Preserve the raw value; recover lifecycle from authoritative history where possible. Do not blindly map it to completed, or infer today's overdue state from it after a deadline extension. |
| Task 5                              | Completed                                | `completed`; the completion timestamp must come from an actual event/fact.                                                                                                                                                                         |
| Task 6                              | Cancelled                                | `cancelled`; retain cancellation date/reason.                                                                                                                                                                                                      |
| Verification 1 / 2 / 3              | Effective / Not effective / Pending      | `effective` / `not_effective` / `pending`; absent/0/unrecognized is `unknown`.                                                                                                                                                                     |
| Source/parent `action_status` 1 / 2 | Open / Closed                            | Parent/source action state, not task state 1/2 and not verification.                                                                                                                                                                               |
| CAPA type 1 / 2 / 3                 | Preventive only / Corrective only / Both | Case/action classification, **not** task lifecycle or effectiveness.                                                                                                                                                                               |

Canonical lifecycle keys: `not_started`, `in_progress`, `on_hold`, `completed`, `cancelled`, `unknown`. For legacy status 4 without recoverable lifecycle, use `unknown` with a legacy-state reason and retain its unfinished classification separately. Overdue remains a separately computed flag, not a seventh mutually exclusive lifecycle state. Surface coverage if unknown lifecycle affects an aggregate.

`is_verification` is an eligibility/verification flag, not an Effective outcome. Only the documented outcome field/assessment establishes Effective, Not effective or Pending. Likewise, observation source type 1/2/3 means observation/hazard/accident; it must not be interpreted as CAPA preventive/corrective classification merely because the numbers overlap.

A task is overdue at `as_of` when unfinished, not cancelled, and its effective due instant is before `as_of`. A date-only due date remains due through the end of that business day. Missing due dates are undated, not automatically overdue. On-hold work keeps its due date unless a stored approved pause/extension changes the applicable rule.

| Metric ID                         | Grain and calculation                                                                                                                                                  | Basis / visualization                                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `capa.total_cases`                | Distinct accessible case UIDs                                                                                                                                          | Snapshot; KPI/context.                                                                                                  |
| `capa.cases_without_tasks`        | Cases with no non-deleted corrective or preventive task; expose whether cancelled-only cases are included                                                              | Snapshot; actionable table.                                                                                             |
| `capa.total_tasks`                | Distinct non-deleted task UIDs                                                                                                                                         | Snapshot; denominator for task distribution.                                                                            |
| `capa.open_tasks`                 | Known unfinished tasks, excluding completed/cancelled; separate unknown classifications                                                                                | Snapshot; KPI.                                                                                                          |
| `capa.tasks_by_status`            | Distinct tasks per canonical lifecycle, including unknown                                                                                                              | Snapshot; partitioned horizontal bars.                                                                                  |
| `capa.overdue_tasks`              | Open eligible tasks whose effective deadline has passed                                                                                                                | Snapshot; overlaps open tasks.                                                                                          |
| `capa.undated_open_tasks`         | Open tasks with no valid effective deadline                                                                                                                            | Snapshot; data-quality queue.                                                                                           |
| `capa.overdue_aging`              | Overdue tasks grouped by business calendar days since due date: 1–7, 8–30, 31–60, 61+                                                                                  | Snapshot; exact buckets with boundary metadata.                                                                         |
| `capa.overdue_by_owner`           | Overdue tasks grouped by primary accountable owner, including unassigned                                                                                               | Snapshot; top-N bars/worklist. If multiple accountable owners are allowed, advertise overlap or define a primary owner. |
| `capa.tasks_by_source`            | Tasks attributed to canonical originating source kind, not every intermediate link                                                                                     | Snapshot; source bars; permission-mask source links.                                                                    |
| `capa.verifications_by_outcome`   | Latest assessment per eligible task for one declared verification scope; effective/not effective/pending/unknown                                                       | Snapshot; outcome bars/partition.                                                                                       |
| `capa.assessed_effectiveness_pct` | Latest effective assessments / (latest effective + not-effective assessments) × 100                                                                                    | Snapshot; pending/unknown excluded and disclosed. It measures assessed outcomes, not overall safety improvement.        |
| `capa.tasks_created`              | Distinct tasks created in each event bucket                                                                                                                            | Flow by `created_at`.                                                                                                   |
| `capa.tasks_completed`            | Distinct tasks reaching final completed state in the bucket under the declared completion-cycle rule                                                                   | Flow by `completed_at`; disclose reopen handling.                                                                       |
| `capa.on_time_completion_pct`     | Completed-in-period eligible tasks completed by the effective deadline applicable at completion / completed-in-period tasks with known valid completion/deadline × 100 | P1 flow cohort; return coverage and approved-extension policy.                                                          |
| `capa.completion_days_p50`        | Median elapsed days from task creation to final eligible completion for completed-in-period tasks                                                                      | P1; exclude cancelled/invalid durations, report sample size.                                                            |

Group `owner_ids` and `capa.overdue_by_owner` by the primary **accountable/follow-up** person, and use `assignee_ids` for the person performing the action. If the server uses different role semantics, publish the mapping in the definition before release. Use IDs, not display names, as group keys.

Canonical task facts needed: UID, tenant, source kind/ID, parent case UID, corrective/preventive kind, project/location/zone, assignee/accountable owner, raw and canonical status, created timestamp, original/effective due date, due-date changes with reasons/approval, completed/cancelled timestamps, reopen events, verification scope/latest outcome/time and authorized source links. Preserve spelling aliases at the transactional adapter boundary; do not spread `coorevtive_tasks`, `previtive_tasks` or nested-source ambiguity into the analytics contract.

Parent closure policy must be explicit. Completing all tasks and obtaining an effective verification are different conditions. Do not mark a case closed merely because a task result exists.

## Audit and personal audit definitions

Source evidence: [audit plan](../../src/features/Organization/InternalAudit/Data/models/plan/InternalAuditPlanModel.ts), [NCR](../../src/features/Organization/InternalAudit/Data/models/ncrs/InternalAuditNcrModel.ts), [attendance](../../src/features/Organization/InternalAudit/Data/models/attendance/InternalAuditAttendanceModel.ts), [report](../../src/features/Organization/InternalAudit/Data/models/reports/InternalAuditReportModel.ts), [audit tabs](../../src/features/Organization/InternalAudit/Presentation/components/InternalAudit.vue).

Plan code values are draft=1, planned=2, reported=3; deployed payloads also use string states. Normalize known strings/numbers to stable keys and keep unknown separate. NCR codes are pending=1, open=2, in-progress=3, closed=4. NCR category codes are minor=1, major=2. Reported plan does not imply all NCRs closed, and a closed NCR does not prove action effectiveness.

| Metric ID                     | Grain and calculation                                                                                                                                                              | Basis / boundary                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `audit.total_plans`           | Distinct eligible plan IDs                                                                                                                                                         | Snapshot; separate company-wide/project-linked.                                               |
| `audit.plans_by_status`       | Draft/planned/reported/unknown plans                                                                                                                                               | Snapshot partition; no invented completed state.                                              |
| `audit.plans_scheduled`       | Plans whose scheduled start falls in the period                                                                                                                                    | Planned flow; do not relabel audits actually performed.                                       |
| `audit.reported_plans`        | Plans with a qualifying report-submitted event in the period                                                                                                                       | Actual event flow; requires report timestamp.                                                 |
| `audit.report_overdue_plans`  | Non-draft eligible plans with effective planned end before as-of and no qualifying submitted report; apply any separately configured reporting deadline if the product defines one | Snapshot; planned-end overdue and report-SLA overdue must have different names if both exist. |
| `audit.ncrs_by_status`        | Distinct NCRs by pending/open/in-progress/closed/unknown                                                                                                                           | Snapshot partition.                                                                           |
| `audit.ncrs_by_category`      | Distinct NCRs by major/minor/unknown                                                                                                                                               | Snapshot partition; not a numeric severity average.                                           |
| `audit.open_major_ncrs`       | Major NCRs in pending/open/in-progress state                                                                                                                                       | Snapshot.                                                                                     |
| `audit.overdue_ncrs`          | Non-closed eligible NCRs with effective due date before as-of                                                                                                                      | Snapshot; undated NCRs separate.                                                              |
| `audit.overdue_ncr_aging`     | Same overdue NCR population in business-day aging buckets                                                                                                                          | Snapshot; same bucket definitions as CAPA.                                                    |
| `audit.ncrs_by_standard`      | Distinct NCRs by directly identified standard                                                                                                                                      | Multi-standard associations can overlap; total remains a distinct union.                      |
| `audit.ncrs_by_area`          | Distinct NCRs by audited area/department                                                                                                                                           | Declare overlap when an NCR covers several areas.                                             |
| `audit.opening_attendance`    | Unique expected roster members marked present at the opening meeting / eligible expected roster members                                                                            | Snapshot ratio; separate auditors and auditees/participants when needed.                      |
| `audit.closing_attendance`    | Same for closing meeting                                                                                                                                                           | Attendance is not exposure/worked hours. Missing roster means unavailable denominator.        |
| `audit.ncrs_created`          | Distinct NCRs raised in each event bucket                                                                                                                                          | Flow by raised/created timestamp.                                                             |
| `audit.ncrs_closed`           | Distinct NCRs reaching final closed state in the bucket                                                                                                                            | Flow by closed timestamp; requires history and reopen policy.                                 |
| `audit.ncr_cohort_closed_pct` | NCRs created in a defined cohort and closed as-of / all eligible NCRs created in that cohort × 100                                                                                 | Cohort ratio; never closed-this-month / opened-this-month without cohort qualification.       |
| `audit.ncr_closure_days_p50`  | Median raised-to-final-close duration for NCRs closed in period                                                                                                                    | P1; valid timestamps and sample size required.                                                |
| `my_audit.upcoming_plans`     | Distinct plans assigned to the authenticated employee with a future/current scheduled start under the advertised horizon                                                           | Personal scope only.                                                                          |
| `my_audit.overdue_ncrs`       | Eligible overdue NCRs/actionable NCR work assigned to the current person under an explicit assignment role                                                                         | Personal scope; distinguish auditee, auditor, lead reviewer and task owner.                   |

An explicit NCR deadline is required for `audit.overdue_ncrs`. Some available wire shapes expose target dates on corrective/preventive actions without an NCR-level due date. Until the NCR deadline is established, return unavailable for NCR-overdue and expose overdue linked **tasks** as a separate metric; do not silently use the earliest task target date as the NCR deadline.

Necessary facts: effective plan schedule and date-change history, report status/submission time, standards and audited scope, assignment roles/effective memberships, expected attendance roster and recorded participation, NCR raise/due/close/reopen events, lead review and canonical action-task links. Existing `open_ncrs_count` and `closed_ncrs_count` are useful register fields; validate their included states/date basis before reusing them as analytics.

If the principal has no mapped employee/participant identity, personal metrics are unavailable with `actor_has_no_employee_identity`; do not guess an employee ID from an organization/user ID or return misleading zeros.

Personal scope must be resolved from authentication. Do not accept an arbitrary employee ID as the definition of “my.” `MY_INTERNAL_AUDIT_*` permission does not grant organization-wide audit aggregates.

## Metrics for the remaining supplied routes

These IDs form the next-delivery registry. They need the same scope, coverage, unit and drilldown metadata as CAPA/audit metrics.

| Module and metric IDs                                                                                                                                             | Formula / source facts                                                                                                                                                    | Constraints and Home eligibility                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `projects.by_status`, `projects.setup_distribution`, `projects.with_open_work`                                                                                    | Distinct projects by lifecycle; server-defined setup ranges; projects with accessible unfinished action/NCR work                                                          | Setup is configuration progress. Optional Home portfolio.                                                                                                                                                  |
| `equipment.by_ownership`, `equipment.by_service_state`, `equipment.by_type`, `equipment.by_warehouse`, `equipment.unassigned`                                     | Distinct current assets; existing ownership enum rent=1/own=2; machine/device/tool classification                                                                         | Not quantities moved or actual utilization. Project assignments need effective-date joins.                                                                                                                 |
| `equipment.rental_due`, `equipment.evidence_due`                                                                                                                  | Effective rental exit date or valid evidence expiry in advertised horizon                                                                                                 | Invalid/missing date separate. Do not derive an expiry from image presence.                                                                                                                                |
| `safety.incidents`, `safety.observations`, `safety.by_zone`, `safety.by_risk`                                                                                     | Incidents from accidents; observations = hazard + observation; occurrence date for trends                                                                                 | Preserve source components and strict unknown sums. Require both hazard/observation read permission for the combined metric. Do not count incidents again as observations.                                 |
| `inspection.due_occurrences`, `inspection.on_time_occurrences`, `inspection.overdue_occurrences`, `inspection.on_time_pct`                                        | Unique eligible occurrences due in period; completion by effective due instant; due but incomplete as-of; on-time numerator / eligible denominator                        | Exclude cancelled occurrences and apply approved extensions. Resubmitted results and result-item rows must not multiply completion.                                                                        |
| `investigation.by_status`, `investigation.awaiting_results`, `investigation.open_aging`, `investigation.root_causes`                                              | Canonical investigation ID/state; qualifying results; elapsed age; distinct classified source events                                                                      | Existing states open/new/in-progress/hold/closed/completed need an explicit final-state mapping. A `hasResults` flag alone is not closure.                                                                 |
| `induction.sessions`, `induction.unique_attendees`, `induction.participations`, `induction.coverage_pct`, `induction.by_topic`                                    | Sessions in period; distinct attendees; distinct attendee/session pairs; eligible required staff with valid induction / eligible required staff                           | Topic/session joins must not duplicate participations. Refresher validity and required population need policy facts.                                                                                       |
| `ppe.required_combinations`, `ppe.satisfied_combinations`, `ppe.outstanding_combinations`, `ppe.coverage_pct`, `ppe.deliveries`                                   | Effective employee/activity/tool requirements; effective delivered satisfaction; unsatisfied eligible requirements; satisfied/required; distinct delivery facts in period | Handle position/activity overlaps, leavers and replacements. Boolean `is_delivery` does not establish physical quantity, stock-on-hand or wear rate.                                                       |
| `objective.by_reporting_state`, `objective.reporting_due`, `objective.actual_target`, `objective.by_department`                                                   | Required periods with effective progress record; per-objective actual/indicator and compatible target/unit                                                                | Existing contract is cumulative with one effective record per period. Use the latest effective reading for that period/as-of; do not sum cumulative months or average heterogeneous objective percentages. |
| `workforce.active`, `workforce.unassigned`, `workforce.by_project`, `workforce.by_position`                                                                       | Distinct accessible employees and effective assignments                                                                                                                   | Project/position groupings may overlap. Do not use assignment totals as organization headcount.                                                                                                            |
| `training.required_combinations`, `training.satisfied_combinations`, `training.expired_combinations`, `training.expiring_records`, `training.employees_with_gaps` | Resolve required employee/requirement pairs from effective positions; choose current evidence; count distinct affected employees separately                               | Existing cell enum valid=1/invalid=2/expired=3/not-required=4. Exclude NotRequired from denominator; no required records means not applicable, not a proven 100% coverage.                                 |
| `org_certificate.by_validity`, `org_certificate.expiring`, `org_certificate.missing_evidence`                                                                     | Effective issued certificates vs expiry and required evidence                                                                                                             | Separate no-expiry/not-required/unknown. Training definitions at `/certificate` are not issued organization certificates.                                                                                  |
| `documents.review_overdue`, `documents.review_due`, `documents.by_category`, `documents.missing_file`                                                             | Current controlled document version; `nex_review_date` source alias normalized to `next_review_date`                                                                      | Document review and certificate expiry are different events. Preserve version-effective periods.                                                                                                           |
| `contractor.by_contract_state`, `contractor.expiring`, `contractor.by_scope`, `contractor.overdue_actions`                                                        | Current contractor contracts/expiry, effective scope memberships, canonical action links                                                                                  | Contract expiry is not a safety-performance score. Scope buckets can overlap.                                                                                                                              |
| `template.usage`, `template.incomplete`, `template.unused`                                                                                                        | Distinct operational uses joined to templates; required definition fields/items                                                                                           | No usage chart based on template count alone. Module-only P2.                                                                                                                                              |
| `position.unmapped_requirements`, `role.unassigned`, `role.membership_distribution`, `scope.unused`                                                               | Position/requirement mappings, role membership, contractor/scope associations                                                                                             | Admin/configuration-only P2. Role privileges are sensitive; position is not a permission role.                                                                                                             |
| `notification.active_plans`, `notification.actions_without_recipients`, `notification.recipient_coverage`                                                         | Configured plan/action/recipient associations                                                                                                                             | Delivered/read/open rates need a separate per-message delivery-event ledger. Do not infer notification success from active plan count.                                                                     |
| `attachments.missing_groups`, `attachments.by_group`                                                                                                              | Required `hse_policy`, `sos`, `standerd_policy` groups and valid current files                                                                                            | Configuration completeness, not certified regulatory compliance.                                                                                                                                           |
| `warehouse.asset_distribution`, `warehouse.empty_definitions`                                                                                                     | Distinct current assets joined to warehouse                                                                                                                               | Physical stock, value and reorder statistics need stock units/movements/cost facts not supplied by warehouse definitions.                                                                                  |
| `coding.unconfigured_resources`, `coding.rule_conflicts`                                                                                                          | Required coded resource types and validated coding rules                                                                                                                  | Prefix/suffix/start are configuration; start is not the last issued serial or transaction volume.                                                                                                          |
| `factor.report_distribution`, `factor_item.report_distribution`, `factor.unclassified_reports`, `reference.unlinked_records`                                      | Canonical report-to-taxonomy/reference relations                                                                                                                          | Factors/factor items are taxonomies, not manufacturing sites. Preserve distinct report totals across multiple classifications.                                                                             |
| `shift.definitions`, `shift.scheduled_duration`, `shift.assignment_distribution`                                                                                  | Shift start/end with overnight rules and effective assignments if stored                                                                                                  | Definitions do not establish actual attendance or exposure hours.                                                                                                                                          |
| `leadership.visits`, `leadership.missing_reports`, `leadership.open_improvements`                                                                                 | Planned visit/date/state, submitted reports, structured improvement actions                                                                                               | Project subfeature; no numeric score from free text.                                                                                                                                                       |
| `drill.planned`, `drill.held`, `drill.missing_results`, `permit.open`, `permit.expired`                                                                           | Effective schedule, actual execution/result/issue/validity/closure facts                                                                                                  | Separate planned/held/reported. Text drill evaluations and permit files do not establish completion by themselves.                                                                                         |
| `loss_time.by_category`                                                                                                                                           | Defined loss-time unit and non-overlapping event intervals by accident category                                                                                           | Existing today/month/year rollups overlap. Do not sum them or use them as worked-hour exposure.                                                                                                            |

Objective reduction semantics deserve explicit treatment: the current frontend accepts a backend `indicator`/achievement value, supports percentage/number/periodic-frequency targets, and has a `numberReduction` policy that can be unset. Return unavailable achievement when the reduction rule/baseline/target is insufficient. Do not guess whether a numeric reduction target is an amount or a final value. Preserve valid achievements above 100; visual progress bars may cap their paint while showing the actual number.

## Proposed read endpoints

Use the existing Bearer authentication, organization prefix and localization headers. POST is consistent with current read services; these operations are read-only.

| Endpoint                                         | Purpose                                                                                                       | Request-specific fields                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---- | ----------------------- |
| `POST organization/fetch_analytics_capabilities` | Authorized modules/metrics, supported filters/dimensions/styles, history availability and definition versions | Shared scope, optional requested module IDs.                   |
| `POST organization/fetch_analytics_snapshot`     | Visible-module KPIs, current distributions and due-work summaries                                             | `modules`, optional `metric_ids`, shared scope/filter context. |
| `POST organization/fetch_analytics_series`       | Event series or reconstructable snapshot series                                                               | `metric_ids`, `grain: day                                      | week | month`, shared context. |
| `POST organization/fetch_analytics_breakdown`    | One grouped metric with pagination/top-N rules                                                                | `metric_id`, `group_by`, `page`, `limit`, shared context.      |
| `POST organization/fetch_analytics_records`      | Exact authorized source records behind a card/bucket                                                          | `drilldown_token`, `page`, `limit`, allowed sort.              |

Do not implement one unbounded response containing every module, every record and every chart. Support independent module requests and resource errors so one failure or permission denial does not blank the whole Home page.

### Shared request

```json
{
  "project_id": null,
  "from_date": "2026-10-01",
  "to_date": "2026-10-28",
  "as_of": null,
  "timezone": "Africa/Cairo",
  "viewer_scope": "organization",
  "include_company_wide": false,
  "filters": {
    "project_location_ids": [],
    "project_zone_ids": [],
    "contractor_ids": [],
    "owner_ids": [],
    "assignee_ids": [],
    "department_ids": [],
    "equipment_type": null,
    "source_types": [],
    "audit_standard_ids": [],
    "ncr_categories": [],
    "statuses": [],
    "verification_outcomes": []
  }
}
```

Empty arrays mean no restriction, not an empty population. Omitted and null `project_id` mean the authenticated authorized organization scope. Validate positive IDs and maximum list sizes; reject contradictory project/location/zone combinations and unsupported filters with HTTP 422. Use distinct `owner_ids` vs current-person scope; do not let `viewer_scope=mine` become an arbitrary impersonation filter.

Proposed filter names are normalized analytics names, not an assertion that current registers accept them. Their adapters currently include different names such as `project_ids`, `location_ids`, `project_zoon_ids`, `date` and `from_date`/`to_date`.

`modules` and `metric_ids` are allowlisted. Unknown IDs return validation errors. Known but denied metrics return `forbidden` without a value or drilldown token; entirely denied requests may return 403. Include only authorized record titles and related-person/source metadata.

### Shared response types

```ts
type Availability = 'available' | 'partial' | 'unavailable' | 'forbidden' | 'error'
type Unit = 'count' | 'percent' | 'days' | 'hours' | 'minutes'
type DateBasis =
  | 'as_of'
  | 'created_at'
  | 'occurred_at'
  | 'due_at'
  | 'completed_at'
  | 'report_submitted_at'
  | 'delivery_date'
  | 'expiry_date'
  | 'review_due_date'
  | 'reporting_period'

interface MetricValue {
  id: string
  status: Availability
  unit: Unit
  value: number | null
  known_count?: number
  numerator: number | null
  denominator: number | null
  date_basis: DateBasis
  definition_version: string
  reason_code: string | null
  coverage: {
    eligible_records: number
    measured_records: number
    missing_records: number
  } | null
  drilldown_token: string | null
}

interface Bucket {
  key: string
  label: string
  value: number | null
  status: Availability
  drilldown_token: string | null
}
```

Stable enum/bucket keys must not be translated; record/category labels may be localized through `Accept-Language`. The frontend owns interface labels. Units and dates must remain machine-readable. State labels/IDs/colors are not server-provided HTML or executable chart options.

### Capabilities example

```json
{
  "status": true,
  "data": {
    "schema_version": 1,
    "modules": {
      "capa": {
        "status": "available",
        "metrics": [
          "capa.open_tasks",
          "capa.overdue_tasks",
          "capa.tasks_by_status",
          "capa.verifications_by_outcome"
        ],
        "dimensions": ["status", "source_type", "project", "owner"],
        "supports_project": true,
        "supports_historical_snapshots": false,
        "supports_event_series": true
      },
      "internal_audit": { "status": "forbidden", "metrics": [] }
    }
  }
}
```

Capabilities are derived from server policy and actual data/history support. Do not rely on a client-supplied permission list.

### Snapshot example

Request extends shared context with `"modules": ["capa"]`. Example parent-case count and task counts are deliberately different grains.

```json
{
  "status": true,
  "data": {
    "schema_version": 1,
    "snapshot_id": "snapshot-example-1",
    "generated_at": "2026-10-28T09:00:00Z",
    "as_of": "2026-10-28T09:00:00Z",
    "timezone": "Africa/Cairo",
    "scope": {
      "project_id": null,
      "viewer_scope": "organization",
      "include_company_wide": false
    },
    "period": { "from_date": "2026-10-01", "to_date": "2026-10-28" },
    "modules": {
      "capa": {
        "status": "available",
        "metrics": [
          {
            "id": "capa.total_cases",
            "status": "available",
            "unit": "count",
            "value": 18,
            "numerator": null,
            "denominator": null,
            "date_basis": "as_of",
            "definition_version": "capa-cases-v1",
            "reason_code": null,
            "coverage": { "eligible_records": 18, "measured_records": 18, "missing_records": 0 },
            "drilldown_token": "example-cases-token"
          },
          {
            "id": "capa.open_tasks",
            "status": "available",
            "unit": "count",
            "value": 26,
            "numerator": null,
            "denominator": null,
            "date_basis": "as_of",
            "definition_version": "capa-open-tasks-v1",
            "reason_code": null,
            "coverage": { "eligible_records": 48, "measured_records": 48, "missing_records": 0 },
            "drilldown_token": "example-open-tasks-token"
          },
          {
            "id": "capa.overdue_tasks",
            "status": "available",
            "unit": "count",
            "value": 9,
            "numerator": null,
            "denominator": null,
            "date_basis": "as_of",
            "definition_version": "capa-overdue-tasks-v1",
            "reason_code": null,
            "coverage": { "eligible_records": 26, "measured_records": 26, "missing_records": 0 },
            "drilldown_token": "example-overdue-token"
          }
        ],
        "breakdowns": [
          {
            "metric_id": "capa.tasks_by_status",
            "group_by": "status",
            "unit": "count",
            "status": "available",
            "total": 48,
            "definition_version": "capa-task-status-v1",
            "date_basis": "as_of",
            "is_partition": true,
            "has_more": false,
            "other_count": 0,
            "buckets": [
              {
                "key": "not_started",
                "label": "Not started",
                "value": 10,
                "status": "available",
                "drilldown_token": "example-not-started"
              },
              {
                "key": "in_progress",
                "label": "In progress",
                "value": 12,
                "status": "available",
                "drilldown_token": "example-in-progress"
              },
              {
                "key": "on_hold",
                "label": "On hold",
                "value": 4,
                "status": "available",
                "drilldown_token": "example-on-hold"
              },
              {
                "key": "completed",
                "label": "Completed",
                "value": 16,
                "status": "available",
                "drilldown_token": "example-completed"
              },
              {
                "key": "cancelled",
                "label": "Cancelled",
                "value": 6,
                "status": "available",
                "drilldown_token": "example-cancelled"
              },
              {
                "key": "unknown",
                "label": "Unknown",
                "value": 0,
                "status": "available",
                "drilldown_token": null
              }
            ]
          }
        ]
      }
    }
  }
}
```

The nine overdue tasks are contained within the 26 open tasks. The status partition totals 48 tasks; it must not add another overdue slice. If a module fails within a successful multi-module response, its status is `error` with null values and a safe reason. Never emit a success envelope with zeroed error metrics.

### Series example

Request: shared context plus `"metric_ids": ["capa.tasks_created", "capa.tasks_completed"], "grain": "month"`. Series metadata must identify whether each is event flow or reconstructed snapshot.

```json
{
  "status": true,
  "data": {
    "snapshot_id": "snapshot-example-1",
    "timezone": "Africa/Cairo",
    "grain": "month",
    "buckets": [
      {
        "key": "2026-09",
        "from_date": "2026-09-01",
        "to_date": "2026-09-30",
        "is_partial_period": false
      },
      {
        "key": "2026-10",
        "from_date": "2026-10-01",
        "to_date": "2026-10-28",
        "is_partial_period": true
      }
    ],
    "series": [
      {
        "metric_id": "capa.tasks_created",
        "unit": "count",
        "date_basis": "created_at",
        "definition_version": "capa-created-v1",
        "kind": "event_flow",
        "status": "available",
        "values": [12, 15],
        "coverage": null
      },
      {
        "metric_id": "capa.tasks_completed",
        "unit": "count",
        "date_basis": "completed_at",
        "definition_version": "capa-completed-final-cycle-v1",
        "kind": "event_flow",
        "status": "available",
        "values": [8, 11],
        "coverage": null
      }
    ]
  }
}
```

For this two-month example use a request range beginning 2026-09-01 rather than the one-month shared-request example. Every values array aligns with every bucket. A current partial month is not compared to a complete prior month as though exposure were matched. Missing history is null/unavailable, not a generated string of zeros.

### Breakdown and exact drilldown

Breakdown request adds `metric_id: "audit.ncrs_by_status"`, `group_by: "status"`, and bounded `page`/`limit`. Return snapshot ID, metric definition/date basis, distinct total, partition flag, buckets and pagination. Each bucket carries its own token including that bucket's filter. Multi-dimensional queries must not silently reinterpret `group_by` as a free SQL column.

```json
{
  "status": true,
  "data": {
    "metric_id": "audit.ncrs_by_status",
    "group_by": "status",
    "status": "available",
    "unit": "count",
    "total": 20,
    "definition_version": "audit-ncr-status-v1",
    "date_basis": "as_of",
    "snapshot_id": "snapshot-example-1",
    "is_partition": true,
    "has_more": false,
    "other_count": 0,
    "buckets": [
      {
        "key": "pending",
        "label": "Pending",
        "value": 2,
        "status": "available",
        "drilldown_token": "example-pending"
      },
      {
        "key": "open",
        "label": "Open",
        "value": 8,
        "status": "available",
        "drilldown_token": "example-open"
      },
      {
        "key": "in_progress",
        "label": "In progress",
        "value": 4,
        "status": "available",
        "drilldown_token": "example-in-progress"
      },
      {
        "key": "closed",
        "label": "Closed",
        "value": 6,
        "status": "available",
        "drilldown_token": "example-closed"
      },
      {
        "key": "unknown",
        "label": "Unknown",
        "value": 0,
        "status": "available",
        "drilldown_token": null
      }
    ]
  }
}
```

Records request: `{"drilldown_token":"example-open","page":1,"limit":20,"sort":"due_at_asc"}`.

```json
{
  "status": true,
  "data": {
    "snapshot_id": "snapshot-example-1",
    "metric_id": "audit.ncrs_by_status",
    "bucket_key": "open",
    "total": 8,
    "page": 1,
    "limit": 20,
    "rows": [
      {
        "uid": "ncr:example-1",
        "resource_type": "internal_audit_ncr",
        "resource_id": 101,
        "title": "Example NCR",
        "status": "open",
        "due_at": "2026-10-20T20:59:59Z",
        "project": null,
        "owner": { "id": 201, "name": "Example owner" },
        "source_route": "/organization/internal-audit/ncr/101"
      }
    ]
  }
}
```

This shortened rows array illustrates the row structure; a real untruncated first page with `total=8` and `limit=20` must contain all eight accessible records. No sample rows belong in production responses.

Tokens are opaque, expiring, signed or server-stored query references bound to tenant, user authorization context, metric/bucket, scope, definition and snapshot. Reauthorize every records request; a token is not a permission grant. Validate `source_route` against known internal route types and resolve the correct source identifier. Never expose external URLs, raw SQL or hidden record metadata.

The records total must reconcile with the originating metric under the same snapshot and visibility. For changed data, either keep a bounded immutable snapshot/result-set reference or return an explicit `snapshot_expired`/`snapshot_changed` response requiring refresh; do not silently return a contradictory live total.

## Authorization and operational requirements

### Permission mapping

- Projects: project read; assets: organization/equipment read under existing policy; incidents: incident read; combined observations: observation **and** hazard read; investigations and inspections: their own read grants.
- CAPA: `CAPA_ALL`/`CAPA_FETCH` plus applicable record-level policy. Parent-source detail/title/navigation remains independently authorized.
- Organization audits: `INTERNAL_AUDIT_ALL`/`INTERNAL_AUDIT_FETCH` and appropriate details permission for record drilldown.
- Personal audits: `MY_INTERNAL_AUDIT_*` grants and authenticated employee relationships; no organization-wide aggregates for a personal-only user.
- PPE: activity/tool/matrix/delivery access and employee/project policy for the requested grain. Requirements may need several resource grants.
- Workforce evidence: employee-certificate read plus authorized employee and requirement applicability. Mask personal details when they are not needed for an aggregate.
- Organization certificates/documents, roles, scopes, notification configuration and other master data: use their actual read/resource policies. The sidebar includes broad role/create/update permissions for visibility; visibility is not analytics authorization.

Avoid fetching an all-modules mixed response and removing forbidden fields in JavaScript. Apply tenant/row policies before aggregation. Do not reveal denied counts through totals, `other`, coverage, comparison or drilldown links. Cache keys must include authorization scope/version; invalidation after role/assignment changes is required.

### Query performance and freshness

Set bounded module/metric counts, date windows, grain, page size and dimension cardinality. Return top-N plus an explicit other/unknown/unassigned strategy. Use stable sorting with UID tie-breakers. Never return all raw records just to render a chart.

Index tenant + project + event/deadline/status keys according to actual query plans; effective assignment/history queries need appropriate temporal indexes. Suggested logical facts and indexes are not database table names prescribed by the frontend.

Use short-lived, authorization-scoped aggregate caches and invalidate relevant entries after changes to task state, deadlines, verification, NCR state, audit schedule/report/attendance, requirements, evidence expiry/renewal, assignments, objectives and PPE deliveries. Return `generated_at`, `as_of` and an optional stale/cache age marker. Do not cache an error as a measured zero.

For large trend queries, use daily facts or materialized aggregates after the event-grain definitions are fixed. Record the definition version and refresh lag. An async export/aggregation design may follow later; this delivery does not require notification/email sending.

### Historical facts needed beyond the first snapshot

Keep append-only or equivalently auditable events for status changes, deadline/extension changes, completion/reopen cycles, verification outcomes, audit reporting/NCR closure, roster assignments, requirement/evidence effective versions, PPE issues/returns/replacements and objective corrections. Each fact needs tenant, resource UID, effective timestamp, recorded timestamp and actor/source where relevant.

Do not synthesize a historical event from a current row's `updated_at`. Backfill only where evidence supports the event, tag the provenance/coverage, and expose unavailable history otherwise. A backdated correction and the time it was recorded are different facts.

Exposure-based injury rates, stock-value/utilization statistics, notification delivery success and worked-hour measures remain unavailable until their missing denominator/event facts exist and are validated. No composite safety score is included.

## Backend delivery and acceptance tests

### P0

1. Confirm canonical case/task/NCR/plan identities, legacy state mappings, overdue date rules, full-company inclusion, personal scope and authorization with the frontend.
2. Implement capabilities + independent CAPA/audit snapshots + exact records drilldown.
3. Return known/unknown coverage and definition/date metadata; preserve null counts in personal-audit/register adapters.
4. Support the existing two-series safety contract and distinct series colors through the frontend's data mapping; the API does not need to send CSS colors.

### P1

Implement series/history, audit attendance denominators, inspection occurrence accounting, workforce/evidence requirements, controlled document reviews, induction/PPE coverage and effective objective progress. Add project comparisons only where the same grain/scope/date basis can be applied.

### Required test cases

| Case                                                                  | Expected result                                                                                                                          |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| One source appears through observation, investigation and NCR joins   | Canonical case/task deduplication; no multiplication by media, standards or employees.                                                   |
| One case has two corrective and three preventive tasks                | One case, five tasks; type and lifecycle distributions reconcile separately.                                                             |
| Task states 0 and 1; legacy state 4; unknown code                     | 0/1 normalize together; raw overdue state is not silently treated as a lifecycle or current deadline proof; unknown coverage is visible. |
| Due today vs yesterday, missing due date, approved extension, on hold | Business-day boundary and effective deadline apply; no-date work is not overdue by default.                                              |
| Completed task reopened twice                                         | Snapshot state and completion flow obey the published cycle rule; no accidental duplicate throughput.                                    |
| Verification pending, ineffective, effective, missing                 | Assessed-effectiveness numerator/denominator exclude pending/missing and include coverage.                                               |
| Reported audit with open major NCRs                                   | Report state is reported; open major NCRs remain counted.                                                                                |
| Company-wide audit linked to several projects                         | Distinct plan/NCR totals; explicit non-additive project associations or declared allocation.                                             |
| My-audit user changes owner filter                                    | Cannot turn personal scope into organization or another person's scope.                                                                  |
| Audit attendance missing roster                                       | Null denominator/unavailable ratio, not 0% or 100%.                                                                                      |
| Cancelled inspection occurrence, extension, several results/items     | Eligible occurrence denominator and completed occurrence numerator remain at occurrence grain.                                           |
| Employee has two positions requiring the same training                | One effective required employee/requirement pair, latest valid evidence chosen once.                                                     |
| PPE activity duplication, repeat deliveries, optional tool            | Coverage follows requirement grain; transactions/physical quantity are not conflated.                                                    |
| Cumulative objective readings 10 then 15 with a correction to 12      | Effective latest reading 12 under its period/as-of semantics; never total 37 or add the superseded reading.                              |
| One-zone safety response `{hazard:4, accidents:7, observation:0}`     | Incidents 7; combined observations 4. Missing component remains unknown, not zero.                                                       |
| Partial/denied module, role change, tenant switch                     | No hidden counts or stale authorized data leak through totals, cache or drilldown.                                                       |
| Empty complete bucket vs missing history vs zero denominator          | Respectively 0, null/unavailable, null ratio with reason.                                                                                |
| Paginated source list                                                 | Global aggregates do not change with page size; records total reconciles under the snapshot.                                             |
| Timezone day boundary and calendar transition                         | Correct local-period inclusion; UTC range conversion and bucket labels agree.                                                            |
| Unknown metric, unsupported filter, mismatched project/zone           | HTTP 422 with a field-level validation error; no silent fallback.                                                                        |

Sign-off requires shared fixture payloads for normal, empty, unknown, partial, forbidden, expired-snapshot and server-error cases, plus a successful frontend reconciliation of each launch KPI with its authorized records list.
