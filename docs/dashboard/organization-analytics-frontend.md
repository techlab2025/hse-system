# Organization analytics frontend implementation plan

Build CAPA and internal-audit analytics first, then extend the same components to operations, workforce assurance, PPE, inductions and objectives. Keep reference-data statistics on their own screens instead of filling Home with configuration counts.

This is an implementation specification, not a claim that the proposed analytics endpoints or widgets already exist. The companion [backend contract](organization-analytics-backend.md) defines the metrics, response structures and aggregation rules. The existing [dashboard requirements](../../ORGANIZATION_DASHBOARD_BACKEND_REQUIREMENTS.md) remain useful background; this plan expands coverage to the supplied sidebar groups.

## Review scope and evidence

Target: `https://sys.hse.techlabeg.com/organization`. Review date: 2026-10-28. Scope: all 34 active links in `OperationsRoutes`, `CompanyRoutes` and `OrganizationRoutes`, including Tools, Devices and Machines. Commented-out Today Talks and Management of Change are not independent launch targets; implemented project subfeatures are included below.

Source review follows [organization navigation](../../src/shared/LayoutComponents/organizationNavigation.ts), [registered organization routes](../../src/router/routes/organization/index.ts), component forms, models, parameters and [API names](../../src/base/core/networkStructure/apiNames.ts). Lists, forms and detail sections establish available operational concepts; paginated list rows do not establish organization-wide analytics totals.

Live review results and any inaccessible detail screens are recorded in the review appendix. Fixture walkthroughs are supplementary UI evidence, not evidence of production counts or backend completeness. No create, update, delete, status change, report submission or verification submission is part of this review.

## Repository Home behavior and agreed contracts to preserve

- Safety reports have **two** series: Incidents = `all_observations.accidents`; Observations = `hazard + observation`. If either observation component is unknown, its combined value is unknown. Do not add hazards again to the combined observations count.
- Grouped circular charts use one dataset per location and a distinct slice/color for each series. A one-zone response `{hazard: 4, accidents: 7, observation: 0}` must show 7 incidents and 4 observations with different selected colors.
- Current Home sources are the inspection/observation summary, safety by zone, equipment statistics and paginated projects. Existing CAPA support is an open-actions summary count, not a complete task, overdue or effectiveness contract.
- Keep metric cards, module-specific permissions, project selection, independent errors/retry, Arabic/English, accessible data tables and mobile layouts.
- Keep System Identity style, custom colors, legend/grid, height, panel order, visibility and widths. `USE_SYSTEM_IDENTITY_API = false` saves the complete preferences locally; `true` uses the existing identity API. Analytics data always comes from authorized read services, independently of preference storage.

Implementation anchors: [Home](../../src/features/Home/presentation/Components/OragnizationHome.vue), [dashboard loader](../../src/features/Home/presentation/composables/useOrganizationDashboard.ts), [permissions](../../src/features/Home/presentation/composables/dashboardPermissions.ts), [chart preferences](../../src/features/SystemIdentity/dashboard.ts), [chart renderer](../../src/features/Home/presentation/Components/Dashboard/DashboardCustomChart.vue), [identity editor](../../src/features/SystemIdentity/components/IdentityDashboardEditor.vue).

## Complete sidebar coverage and chart opportunities

P0 = first delivery; P1 = next delivery; P2 = optional module/configuration reporting. “Data needed” identifies an aggregate contract or extra facts; it does not mean the transactional feature is absent. Every path below is an existing sidebar destination.

### Operations

| Existing route                                                  | Features to carry into analytics                                                                                             | Proposed statistics and visual                                                                                                        | Placement and data needed                                                                                                                     |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `/organization/projects`                                        | Project list, setup flow, project summary, scope, sites/zones, workforce, equipment, meetings, drills and loss-time sections | Portfolio by lifecycle; setup-progress distribution; scoped action/NCR backlog per project; project comparison table                  | P1 Home portfolio + project summary. Separate setup progress from safety performance; unique project counts and scoped aggregates.            |
| `/organization/equipments`                                      | Asset register, equipment types, ownership, service state, assignment, evidence and rental dates                             | Owned/rented; in/out of service; unassigned assets; expiring evidence; rental exits due                                               | P1 Home equipment + register strip. Count distinct assets, not assignments.                                                                   |
| `/organization/equipments?equipment_type=3`                     | Tools subset and its details                                                                                                 | Same asset charts filtered to Tools                                                                                                   | P1 register; shared equipment endpoint with `equipment_type=3`.                                                                               |
| `/organization/equipments?equipment_type=2`                     | Devices subset and its details                                                                                               | Same asset charts filtered to Devices                                                                                                 | P1 register; `equipment_type=2`.                                                                                                              |
| `/organization/equipments?equipment_type=1`                     | Machines subset and its details                                                                                              | Same asset charts filtered to Machines                                                                                                | P1 register; `equipment_type=1`. Hours/utilization need an explicit exposure denominator.                                                     |
| `/organization/equipment-mangement/incedant?isAll=1`            | Incident reports, occurrence date, source/project/zone, near miss, people/injury, investigation/CAPA links                   | Incident counts over time; category/severity distribution; investigation-link coverage; unresolved linked actions                     | P1 Home safety + incident register. Distinct incident IDs, explicit occurrence-date basis and classification.                                 |
| `/organization/equipment-mangement/observation?isAll=1&type=2`  | Observation/hazard source reports, risk level, work stopped, equipment/location, action links                                | Combined observation counts; component breakdown in the module; risk distribution; open follow-up; reporting trend                    | P1 Home + register. Combined metric retains the agreed hazard-plus-observation rule.                                                          |
| `/organization/equipment-mangement/inspection?inspectionType=1` | Schedules, recurring task periods, assigned inspector, overdue list, results and result detail                               | Eligible due occurrences vs completed on time; overdue occurrences; results awaiting completion; by template/project                  | P1 Home + inspection strip. New occurrence-level denominator required; do not divide result count by schedule count.                          |
| `/organization/Investigating`                                   | Register, team/leader, meetings, results/answers, corrective/preventive tasks                                                | Lifecycle counts; cases awaiting results; aging; overdue linked tasks; confirmed root-cause frequency                                 | P1 Home investigation panel + register. Canonical state mapping and dated events required.                                                    |
| `/organization/capa`                                            | All/NCR/Investigation source tabs; source details; corrective and preventive tasks; status/reason; answers; verification     | **Task status, overdue aging, owners with overdue work, verification outcomes, completion throughput and parent cases without tasks** | **P0 expand the existing corrective panel + CAPA module view.** Parent cases, tasks and verification assessments have different denominators. |

### Company

| Existing route                          | Features to carry into analytics                                                                                                      | Proposed statistics and visual                                                                                                                      | Placement and data needed                                                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/organization/inductions`              | Session list/add/edit/show; instructor; topic; date; project/location/zone; attendees and evidence                                    | Sessions held; distinct attendees; attendee-session participations; topic coverage; required employees not inducted                                 | P1 module + optional Home. Coverage needs a server-defined required population and eligible induction rules.                      |
| `/organization/ppe-matrix`              | Activity/tool matrix, settings, employee delivery, delivery log, delivery date/project, per-tool delivered flags                      | Required vs delivered employee/activity/tool combinations; outstanding requirements; delivery trend; gaps by activity/tool/project                  | P1 module + optional Home. A delivery row is not automatically a physical quantity; replacement/returns require additional facts. |
| `/organization/objectives`              | Objective list/add/edit, target type/direction/unit/baseline, department/follow-up owner; details, progress history/update/correction | Objectives on track/behind/unknown; overdue reporting periods; per-objective actual vs target; department distribution                              | P1 module + optional Home. Use the existing cumulative progress semantics; never sum cumulative period snapshots.                 |
| `/organization/internal-audit/register` | Audit register; plan, scope, standards, team/lead/auditee, schedule/date changes; attendance, NCRs, report                            | **Plans by state; plans due without a report; major/minor NCRs; NCR status and overdue aging; NCRs by standard/area; reporting and closure trends** | **P0 new audit Home panel + register statistics.** Plan reporting, NCR closure and action effectiveness remain separate.          |
| `/organization/my-internal-audit`       | Assigned audits and their NCRs for the authenticated person                                                                           | My upcoming audits; my open/overdue NCR work; personal due-date queue                                                                               | P0 personal strip/worklist. Server determines “my”; never use organization-wide counts with a client-side owner filter.           |

### Organization settings and assurance

| Existing route                           | Features to carry into analytics                                                                            | Proposed statistics and visual                                                                            | Placement and data needed                                                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/organization/system-identity`          | Branding, fonts, colors, layout, sidebar, chart preferences and preview                                     | Widget catalog, module group, chart type, per-series colors, position/width/visibility, reset             | P0 preference integration; configuration completeness is optional P2, not a safety KPI.                                |
| `/organization/certificate`              | Certificate/training requirement definitions; industry/position applicability, evidence/expiry requirements | Requirement definitions by applicability; positions without required training mappings                    | P2 configuration view. Definition count is not valid issued-certificate count.                                         |
| `/organization/organization-certificate` | Issued organization certificates; issuing body/number, issue/expiry date, file                              | Valid/expired/expiring certificates; expiry timeline; missing required evidence                           | P1 assurance panel. Treat no-expiry certificates separately; confirm organization-vs-project applicability.            |
| `/organization/organization-documents`   | Controlled document reference/version, category, issue date, `nex_review_date`, file                        | Review overdue/due soon; documents by category; missing file or review date                               | P1 assurance/module view. Keep document review distinct from certificate expiration.                                   |
| `/organization/template`                 | Template definitions, items, tags, image requirements and usage in inspections                              | Used/unused templates; incomplete templates; inspections/results by template                              | P2 module. Actual usage requires a join to transactions, not the template list alone.                                  |
| `/organization/herikaly`                 | Position hierarchy, child positions and certificate requirements                                            | Employees/assignments by position; unmapped positions; missing required certificate combinations          | P1 assurance + P2 configuration. Do not confuse positions with permission roles.                                       |
| `/organization/organization-employee`    | Employee register/details; status, positions, roles, project assignments, certificates and tasks            | Active staff; unassigned staff; distinct staff per project; certification gaps; assigned overdue work     | P1 Home workforce/module. Many-to-many project membership is not an additive headcount partition.                      |
| `/organization/contractor`               | Contractor details, scopes, contact, contract status, expiry and file                                       | Contracts expired/expiring; contractors by scope; project-linked overdue actions                          | P1 module/assurance. Contract status and safety performance are separate.                                              |
| `/organization/role`                     | Role definitions and permission assignments                                                                 | Roles without members; privileged role distribution; assignment gaps                                      | P2 admin-only table/bar. This is access configuration, not employee performance.                                       |
| `/organization/notification-plan`        | Active flag, actions/sub-actions, selected employees and positions                                          | Active plans; actions without recipients; overlapping recipient coverage                                  | P2 configuration view. Sent/delivered/read rates require a delivery-event ledger not present in the plan model.        |
| `/organization/attachment-matrix`        | `hse_policy`, `sos`, `standerd_policy` attachment groups                                                    | Required groups missing evidence; files per group                                                         | P2 completeness checklist, preferably a small table rather than a chart. Do not declare compliance from file presence. |
| `/organization/scope`                    | Contractor scope definitions and associations                                                               | Assigned/unassigned scope definitions; contractor distribution by scope                                   | P2 configuration. Multi-scope contractor counts can overlap.                                                           |
| `/organization/where-house`              | Warehouse definitions, warehouse type and linked assets                                                     | Asset count per warehouse; unassigned assets; warehouses with no assets                                   | P2 module. Stock levels, low-stock alerts and inventory value require quantities and stock movements.                  |
| `/organization/employee-certificate`     | Employee-by-requirement matrix; valid, invalid, expired, not-required cells; renewal/evidence dialogs       | Required combinations satisfied/missing/expired; expiring employee evidence; distinct employees with gaps | P1 Home workforce + matrix strip. Exclude NotRequired cells from required coverage.                                    |
| `/organization/serial-number`            | Coding definitions by resource; prefix, suffix and sequence start                                           | Resources without a coding rule; rule collisions if server validation supports them                       | P2 configuration checklist. Do not present the configured start as “records created.”                                  |
| `/organization/factory`                  | Factor taxonomy and industry applicability                                                                  | Unclassified reports; reports by factor; taxonomy items never used                                        | P2 source-coding/module view. These are factors, not production factories.                                             |
| `/organization/factories-items`          | Factor-item taxonomy, parent factor and industries                                                          | Reports by factor item; unmapped factor items; distribution inside a factor                               | P2 source-coding/module view. Requires record-to-factor-item relations.                                                |
| `/organization/document-refrence`        | Document-reference master data                                                                              | Missing references on controlled records; references used by category/module                              | P2 module. Not a second copy of document-review deadlines.                                                             |
| `/organization/shifts`                   | Shift title and scheduled start/end times                                                                   | Shift definitions; scheduled duration with overnight handling; assignments by shift if supported          | P2 scheduling/module view. Shift definitions alone cannot produce worked hours, attendance or incident rates.          |

## Nested project and detail features

These are reached through the supplied modules rather than additional top-level launch items. Existing route patterns and components must be reused for drilldown, with permission checks for the source record.

| Feature journey                             | Existing paths or navigation                                                                                                       | Analytics opportunity and boundary                                                                                                                                                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project creation and setup                  | `/organization/project/add`, `/organization/project/flow/:id?/:step?`, `/organization/project/:id`                                 | Setup-stage and incomplete-scope counts; never label them safety effectiveness.                                                                                                                            |
| Project overview and summary                | `/organization/project-details/:id`, `/organization/project-summary/:id`, `/organization/project-summary/:id/data/:resource`       | Reuse aggregate filters for project-scoped operations, equipment, meetings, drills, loss time and workforce. Existing detail/summary section tabs are not separate organizations.                          |
| Site, zones, teams, positions and workforce | Project scope and operations sections; existing location/team/employee dialogs                                                     | Unassigned positions/assets; coverage by site/zone; distinct staff vs assignment counts.                                                                                                                   |
| Leadership                                  | `/organization/project-details/:id/leadership`, `/leadership/visits`, `/leadership/visits/:visitId/report` under that project path | Planned/held visits; missing reports; improvement follow-up. Structured completion/date rules are needed for timeliness.                                                                                   |
| Risk assessments                            | Project risk-assessment routes and detail dialog                                                                                   | Assessments by activity/risk; review due dates only if an explicit review schedule exists. Do not invent a review SLA.                                                                                     |
| Meetings and drills                         | `/organization/project-meetings/:project_id`; project meeting/drill routes and result/timeline views                               | Scheduled vs held/reported, overdue follow-up and drill type. Text evaluation is not a numeric effectiveness score.                                                                                        |
| Permit to work                              | Project permit list, issue/answer/result and related inspection/certificate views                                                  | Open/expired permits, permit results awaiting review, type/project breakdown. Backend must distinguish permit validity from authorization/closure.                                                         |
| Loss time                                   | Project summary/detail loss-time matrix                                                                                            | Display defined loss-time counts/durations by accident category only after the unit/date basis is confirmed. Existing daily/monthly/yearly rollups are not exposure hours and must not be summed together. |
| Equipment detail and evidence               | Existing equipment add/edit/detail and project assignment views                                                                    | Asset assurance, rental deadlines, license/certificate gaps. Assignment records must not multiply inventory counts.                                                                                        |
| Inspection audit views                      | `/organization/equipment-mangement/audits/:id` and its add route                                                                   | These reuse inspection components. Keep inspection audit results separate from the Internal Audit plan/NCR lifecycle.                                                                                      |
| Incident and observation detail             | Existing report add/edit/show, people/injury, evidence, linked investigation/CAPA                                                  | Record-level drilldown for the two Home safety series. Preserve source kind so observations/hazards/incidents are not joined ambiguously.                                                                  |
| Investigation detail                        | `/organization/Investigating/:id`, `/organization/Investigating-result/:id`, `/organization/Investigating-result-answer/:id`       | Meetings/results, root causes, actions, lessons learnt and verification dependencies.                                                                                                                      |
| CAPA detail                                 | `/organization/capa/:id`                                                                                                           | Corrective/preventive tasks; status/reason; answer/evidence; verification. Current details parameter is `observation_capa_id`; do not navigate to a raw NCR task ID as though it were that CAPA ID.        |
| Audit lifecycle                             | `/organization/internal-audit?internal_audit_plan_id=:id&tab=plan`, then `attendance`, `ncrs`, `report`                            | Plan/schedule, opening/closing attendance, NCRs and report completeness. Plans must exist before the later tabs are enabled.                                                                               |
| NCR detail and personal audit               | `/organization/internal-audit/ncr/:id`, `/organization/my-internal-audit/:id`                                                      | Major/minor category, status, due date, audited area, lead review and linked corrective/preventive tasks.                                                                                                  |
| Objective progress                          | `/organization/objectives/:objectiveId/details` and its progress update/edit routes                                                | Per-period actual and target, reporting coverage, correction history. Corrections replace the period's effective reading instead of adding another accomplishment.                                         |
| PPE issue history                           | `/organization/ppe-delivery`, `/organization/ppe-deliveries`, `/organization/ppe-matrix-settings`                                  | Requirement matrix vs issued combinations and dated deliveries; preserve employee/activity/tool grain.                                                                                                     |

## First delivery on Home

### CAPA panel

Expand the current `corrective` panel in place so users keep its saved position. Existing summary count can remain until the module aggregate arrives, but must retain its original label/date limitations.

| Widget ID proposed for the preference catalog | Metric IDs from backend contract                                | Display and interaction                                                                                                 |
| --------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `capaTaskStatus`                              | `capa.tasks_by_status`, `capa.open_tasks`, `capa.overdue_tasks` | KPI counts + horizontal bars. Overdue is an overlapping deadline flag, not another slice added to open/completed tasks. |
| `capaOverdueOwners`                           | `capa.overdue_by_owner`                                         | Top owners, unassigned bucket, exact counts, accessible table; click to authorized tasks.                               |
| `capaVerification`                            | `capa.verifications_by_outcome`                                 | Effective / Not effective / Pending / Unknown; assessed-effectiveness ratio includes its denominator.                   |
| `capaFlow`                                    | `capa.tasks_created`, `capa.tasks_completed`                    | Event-date lines/bars by period; no flow chart from a snapshot endpoint.                                                |

The CAPA register's All/NCR/Investigation chips currently count loaded items. Keep them as list controls; do not reuse them as global Home metrics. One parent with six actions contributes one parent case and six tasks, not seven CAPAs.

### Audit panel

Add an `audits` panel after existing panels, initially optional for users whose saved layout predates it. Internal audit and personal audit remain separate scopes.

| Widget ID proposed | Metric IDs                                                            | Display and interaction                                                                                                    |
| ------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `auditPlanStatus`  | `audit.plans_by_status`, `audit.report_overdue_plans`                 | Draft / Planned / Reported counts; report-overdue queue; planned end date visible. Reported does not mean all NCRs closed. |
| `auditNcrStatus`   | `audit.ncrs_by_status`, `audit.open_major_ncrs`, `audit.overdue_ncrs` | Pending / Open / In progress / Closed, major/minor grouping and overdue indicator.                                         |
| `auditNcrAging`    | `audit.overdue_ncr_aging`                                             | Due-date aging buckets with record drilldown.                                                                              |
| `auditAttendance`  | `audit.opening_attendance`, `audit.closing_attendance`                | Attended / expected counts and ratio, only when the expected roster is known.                                              |
| `myAuditQueue`     | `my_audit.upcoming_plans`, `my_audit.overdue_ncrs`                    | Personal cards/worklist using authenticated server context.                                                                |

Suggested Home order for new installations: headline KPIs → existing safety/inspection/equipment → CAPA → audits → assurance/workforce → projects. Preserve existing saved order and do not force every module onto Home.

## Shared analytics UI and data flow

Proposed implementation files belong under `src/features/Home` or a shared `OrganizationAnalytics` feature, using the existing API service → repository → use case → controller/composable pattern.

1. Fetch capabilities for the authenticated organization/project and build a metric/widget catalog from an explicit client allowlist.
2. Load visible module snapshots independently. Do not fetch every register page or one detail endpoint per row to compute charts.
3. Fetch series only for visible trend widgets, breakdown pages only when requested, and worklist rows only for visible/expanded sections.
4. Normalize nullable counts, numerator/denominator and availability before building chart data.
5. Attach server-issued drilldown tokens to bars/cards. Open the existing source route when its filter contract is supported; otherwise open a proposed analytics records drawer backed by `fetch_analytics_records`.
6. Reject stale responses after organization/project/filter changes. Cache by tenant identity, scope, metric IDs, filters, date basis and definition version; clear data on logout/tenant change.
7. Cancel/unsubscribe requests on unmount. A hidden chart preference never bypasses read permissions or authorizes a data request.

A proposed `AnalyticsPanel` should accept resource status, title, date-basis label, unit, sample/coverage metadata, chart data, allowed styles and drilldown handler. Keep the existing `DashboardPanel` resource states and data-table fallback.

### Filters

- Global: selected project or organization, date window, business timezone and supported comparison window. Pass the global project selection to new services rather than maintaining a disconnected selector.
- Module-specific: location/zone, contractor, equipment type, owner/assignee, department, audit standard, NCR category, source kind, lifecycle status and verification outcome, but only when capabilities advertise support.
- Show “Current backlog as of …” for snapshot open/overdue metrics and “Created/completed during …” for flows. A single date picker must not make these populations look identical.
- Organization-only modules such as role or coding definitions must show that scope. If a project filter is unsupported, disable it explicitly or show “Organization-wide”; never silently drop it.
- For company-wide audits under a project filter, provide an explicit include-company-wide option. Count each plan/NCR once.
- Date filters written into a URL are useful only if the target register actually reads them. Where existing filters differ (`date`, `project_id`, `project_ids`, `location_ids`, `project_zoon_ids`), use an adapter or the analytics records drawer.

### Chart style and color rules

- Two safety series always remain Incidents and combined Observations. Slot 1 controls Incidents, slot 2 Observations. A single zone must never cause the two series to inherit one zone color.
- Keep all current style options for compatible categorical data. Allow stacked bars only for additive series; pie/doughnut only for an exclusive partition; percentage cards or progress indicators only for a supplied numerator/denominator with a valid target.
- Current-overdue and open counts overlap: show separate cards or an annotated table, not two parts of one doughnut.
- Trend charts need chronological buckets; do not relabel work zones as months. Percentage/rate widgets must not use the count-only axis/formatter.
- Grouped circular charts have a ring/dataset per location and slices per series. Preserve original labels/counts in the accompanying table.
- Keep per-chart custom colors independent, validate hex colors, preserve inactive custom palettes, and use labels/icons as well as color. Automatic semantic color changes must not overwrite saved selections.

### System Identity migration

The current `PanelId` and `ChartId` unions and `normalizeDashboard` use fixed allowlists. New IDs must be added to the catalog, defaults, normalization, editor and Home rendering together; otherwise saved new widgets will be discarded.

Preserve the existing `safety`, `inspection`, `equipment`, `corrective`, `workforce`, `projects`, `actions` panel IDs and six existing chart IDs. Add a schema version before changing the stored shape. Add optional new panels to existing preferences without reordering them, share no mutable default arrays, and keep future unknown IDs in a migration strategy rather than silently treating them as authorized widgets. Test both local storage and API storage with old identities.

The first delivery can extend the current panel/chart allowlists. A later dynamic widget system can replace them through an explicit migration; it is not required to launch CAPA/audit charts.

### States, accessibility and internationalization

Each metric/panel has independent loading, available, partial, unavailable, forbidden and error states. A known zero shows `0`; an unknown total shows “Not available” or `—`, with a reason. Missing data, an empty result, a filter with no records, and denied access are different states.

- Ratios show numerator/denominator and unit. Denominator zero shows no percentage, never 0% or 100% by default.
- Explain partial coverage and the as-of timestamp; hide unsupported comparisons rather than inventing arrows.
- Every chart has an accessible name, keyboard-accessible legend/drilldown alternatives and an equivalent data table. Hover alone cannot be the only way to read values.
- Localize client-owned labels and number/date formatting; display API/user-entered record titles unchanged. Preserve RTL placement, direction and tab order after drag/reorder.
- At 375, 768, 1024 and 1440 pixels, avoid page overflow and keep chart heights bounded. Respect reduced motion.

## Delivery and acceptance

| Stage | Frontend deliverables                                                                                                                                  | Backend dependency                                                                                                   |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| P0    | CAPA task/status/overdue/verification; audit plan/NCR panels; personal audit queue; capability-aware visibility; exact drilldown; preference migration | Capabilities, module snapshot, records drilldown, agreed status/identity mappings and due-date rules.                |
| P1    | Event trends; induction/PPE/objective reporting; certificate/document/contract expiry; inspection occurrence compliance; project comparisons           | Series/history, occurrence eligibility, requirement matrices, effective objective periods and document/expiry facts. |
| P2    | Leadership/drills/permits follow-up; master-data completeness; notification delivery only after event logging; optional exports                        | Additional typed facts/events and authorization for each module.                                                     |

Acceptance checks:

1. One-zone safety fixture produces 7 incidents and 4 observations and retains independent colors through all supported styles and reload.
2. A CAPA parent with corrective/preventive tasks linked through investigation and NCR is not counted twice. Open/overdue cards disclose their task grain; verification pending is not effective.
3. Audit plans with `reported` state and open NCRs still display the open NCRs. A company-wide audit under multiple projects is counted once. My Audit never includes another user's unassigned work.
4. List pagination and page length never change global KPI totals. A drilldown's authorized total reconciles with its metric under the same snapshot and filters.
5. Missing dates/status/history yield unknown/partial data rather than zeros or invented historical backlogs.
6. Date boundaries, overdue today vs yesterday, no-expiry evidence, overnight shifts and zero denominators have explicit tests.
7. Organization/project switching does not display stale results. A user with CAPA access but no audits can still load CAPA without receiving audit counts.
8. Existing identities retain order/colors/widths; new widgets survive save/reload in both local and API modes. Disabled identity restores default presentation.
9. Arabic/English, keyboard use and responsive widths are verified with populated, empty, partial, forbidden and failed responses.
10. Browser validation performs read-only navigation on production; mutating acceptance tests use an isolated test environment.

## Review appendix

The following live observations and registered-route inventory define what was inspected and what still requires a suitable record for live verification.

### Live walkthrough findings

The production session was authenticated as an organization account. All **34 supplied active sidebar links** were reached. The first live pass recorded 131 navigation/view observations; a follow-up reviewed 49 remaining route entries, and dedicated probes opened CAPA detail, the four audit lifecycle tabs and linked project/report/objective views. Repeated pages and tabs are not counted as different business features.

The route inventory contains **161 distinct in-scope registered patterns**. The table below separates an observed live route from a source-reviewed record-specific screen. A live route observation verifies navigation/read/UI structure, not every possible record, filter, write operation or permission combination.

Observed data and integration findings:

- CAPA reads return mixed NCR/source rows and nested CAPA data; task and source IDs need a canonical analytics identity. The existing detail view exposes separate corrective and preventive action lanes.
- Audit register, plan, attendance, NCR and report read services returned responses. The live attendance table separates opening/closing meeting marks. The NCR list has category, audited area, creator, lead auditor, corrective/preventive assignees and status; its due-date column is not displayed in the current register.
- Personal audit list count fields can be null. Do not treat them as a confirmed zero or derive organization-level NCR totals from that view.
- Project summary exposes All data, Safety statistics, Operations, Equipment, Meetings, Drills, Loss time and Quick access sections. Some project-detail links resolve to the summary view; preserve those actual navigation conventions.
- Objective list rows provide target metadata without guaranteeing a progress summary. Employee-certificate data is an employee-by-requirement matrix, not simply a certificate catalog.
- PPE activity/tool aliases resolve to the PPE matrix settings page. `/ppe-matrix` is the operational company matrix/log, while `/ppe-matrix-settings` is configuration.
- Generic operation errors were observed during some Device, overdue-inspection, hazard and project-permit-template reads. Treat these as review observations requiring endpoint/adapter validation, not proof that an entire feature is absent. Analytics panels need independent error states.
- Strict query-string checks in the first walker did not settle on several redirects/normalized routes. CAPA and audit lifecycle views were subsequently checked directly; such navigation timing is not classified as a product defect.

No verification, task-status, audit-report, induction, PPE, objective, certificate or other record submission was performed. Record-specific edit/report pages without a suitable live record remain source-reviewed. The handoff intentionally contains no access tokens, personal names, production record IDs, attachment URLs or copied business row contents.

### Registered route coverage

“Live” means the route pattern was observed in a live organization navigation. “Redirect” names the observed destination. “Source only” means its route/component/model contract was reviewed but that exact record-specific screen was not verified live. This inventory includes related project subfeatures and configuration aliases beyond the 34 launch links.

| Registered route pattern                                              | Review coverage                                 |
| --------------------------------------------------------------------- | ----------------------------------------------- |
| `/organization/Investigating`                                         | Live                                            |
| `/organization/Investigating-result-answer/:id`                       | Live                                            |
| `/organization/Investigating-result/:id`                              | Live                                            |
| `/organization/Investigating/:id`                                     | Live                                            |
| `/organization/Investigating/add`                                     | Live                                            |
| `/organization/InvestigationMeeting`                                  | Live                                            |
| `/organization/InvestigationMeeting/:id`                              | Live                                            |
| `/organization/InvestigationMeeting/add`                              | Live                                            |
| `/organization/attachment-matrix`                                     | Live                                            |
| `/organization/capa`                                                  | Live                                            |
| `/organization/capa/:id`                                              | Live                                            |
| `/organization/certificate`                                           | Live                                            |
| `/organization/certificate/:id`                                       | Live                                            |
| `/organization/certificate/add`                                       | Live                                            |
| `/organization/certificate/import-excel`                              | Live                                            |
| `/organization/contractor`                                            | Live                                            |
| `/organization/contractor/:id`                                        | Live                                            |
| `/organization/contractor/add`                                        | Live                                            |
| `/organization/document-refrence`                                     | Live                                            |
| `/organization/document-refrence/:id`                                 | Live                                            |
| `/organization/document-refrence/add`                                 | Live                                            |
| `/organization/employee-certificate/:id?`                             | Live                                            |
| `/organization/equipment-mangement`                                   | Live                                            |
| `/organization/equipment-mangement/all-observatin`                    | Live                                            |
| `/organization/equipment-mangement/audits/:id`                        | Live                                            |
| `/organization/equipment-mangement/audits/add/:id?`                   | Live                                            |
| `/organization/equipment-mangement/hazard`                            | Live                                            |
| `/organization/equipment-mangement/hazard/:id`                        | Live                                            |
| `/organization/equipment-mangement/hazard/add`                        | Live                                            |
| `/organization/equipment-mangement/incedant`                          | Live                                            |
| `/organization/equipment-mangement/incedant/:id`                      | Live                                            |
| `/organization/equipment-mangement/incedant/add`                      | Live                                            |
| `/organization/equipment-mangement/incedant/show/:id`                 | Live                                            |
| `/organization/equipment-mangement/incident-report`                   | Live                                            |
| `/organization/equipment-mangement/inspection`                        | Live                                            |
| `/organization/equipment-mangement/inspection/:id`                    | Live                                            |
| `/organization/equipment-mangement/inspection/add/:equipment_id?`     | Live                                            |
| `/organization/equipment-mangement/inspection/overdue`                | Live                                            |
| `/organization/equipment-mangement/inspection/result/:id`             | Live                                            |
| `/organization/equipment-mangement/observation`                       | Live                                            |
| `/organization/equipment-mangement/observation-report`                | Live                                            |
| `/organization/equipment-mangement/observation/:id`                   | Live                                            |
| `/organization/equipment-mangement/observation/add`                   | Live                                            |
| `/organization/equipment-mangement/observation/show/:id`              | Live                                            |
| `/organization/equipment-show/:id`                                    | Live                                            |
| `/organization/equipment-type/:id`                                    | Live                                            |
| `/organization/equipment-type/add/:parent_id?`                        | Live                                            |
| `/organization/equipment-type/upload-excel`                           | Live                                            |
| `/organization/equipment-types/:parent_id?`                           | Live                                            |
| `/organization/equipment/:id/:parent_id?`                             | Live                                            |
| `/organization/equipment/add/:parent_id?`                             | Live                                            |
| `/organization/equipment/upload-excel`                                | Live                                            |
| `/organization/equipments/:parent_id?`                                | Live                                            |
| `/organization/factories-items`                                       | Live                                            |
| `/organization/factory`                                               | Live                                            |
| `/organization/factory-item/:id`                                      | Live                                            |
| `/organization/factory-item/add`                                      | Live                                            |
| `/organization/factory/:id`                                           | Live                                            |
| `/organization/factory/add`                                           | Live                                            |
| `/organization/herikaly`                                              | Live                                            |
| `/organization/herikaly/:id`                                          | Live                                            |
| `/organization/herikaly/add/:parent_id?`                              | Live                                            |
| `/organization/herikaly/matrix`                                       | Live                                            |
| `/organization/herikaly/upload-excel`                                 | Live                                            |
| `/organization/induction/:id`                                         | Live                                            |
| `/organization/induction/add`                                         | Live                                            |
| `/organization/induction/show/:id`                                    | Live                                            |
| `/organization/inductions`                                            | Live                                            |
| `/organization/internal-audit`                                        | Live                                            |
| `/organization/internal-audit/ncr/:id`                                | Source only; requires a suitable live record    |
| `/organization/internal-audit/register`                               | Live                                            |
| `/organization/my-internal-audit`                                     | Live                                            |
| `/organization/my-internal-audit/:id`                                 | Live                                            |
| `/organization/notification-plan`                                     | Live                                            |
| `/organization/notification-plan/add`                                 | Live                                            |
| `/organization/objectives`                                            | Live                                            |
| `/organization/objectives/:id`                                        | Live                                            |
| `/organization/objectives/:objectiveId/details`                       | Live                                            |
| `/organization/objectives/:objectiveId/progress/:progressId/edit`     | Source only; requires a suitable live record    |
| `/organization/objectives/:objectiveId/progress/update`               | Live                                            |
| `/organization/objectives/add`                                        | Live                                            |
| `/organization/organization-certificate`                              | Live                                            |
| `/organization/organization-certificate/:id`                          | Source only; requires a suitable live record    |
| `/organization/organization-certificate/add`                          | Live                                            |
| `/organization/organization-certificate/import-excel`                 | Live                                            |
| `/organization/organization-documents`                                | Live                                            |
| `/organization/organization-documents/:id`                            | Source only; requires a suitable live record    |
| `/organization/organization-documents/add`                            | Live                                            |
| `/organization/organization-documents/import-excel`                   | Live                                            |
| `/organization/organization-employee`                                 | Live                                            |
| `/organization/organization-employee-tasks/:id`                       | Live                                            |
| `/organization/organization-employee/:id`                             | Live                                            |
| `/organization/organization-employee/add`                             | Live                                            |
| `/organization/organization-employee/show/:id`                        | Live                                            |
| `/organization/organization-employee/upload`                          | Live                                            |
| `/organization/ppe-activities`                                        | Redirect to `/organization/ppe-matrix-settings` |
| `/organization/ppe-activity/:id`                                      | Live                                            |
| `/organization/ppe-activity/add`                                      | Live                                            |
| `/organization/ppe-activity/upload-excel`                             | Live                                            |
| `/organization/ppe-deliveries`                                        | Live                                            |
| `/organization/ppe-delivery`                                          | Live                                            |
| `/organization/ppe-item/:id`                                          | Live                                            |
| `/organization/ppe-item/add`                                          | Live                                            |
| `/organization/ppe-item/upload-excel`                                 | Live                                            |
| `/organization/ppe-items`                                             | Live                                            |
| `/organization/ppe-matrix`                                            | Live                                            |
| `/organization/ppe-matrix-settings`                                   | Live                                            |
| `/organization/ppe-tool/:id`                                          | Live                                            |
| `/organization/ppe-tool/add`                                          | Live                                            |
| `/organization/ppe-tool/upload-excel`                                 | Live                                            |
| `/organization/ppe-tools`                                             | Redirect to `/organization/ppe-matrix-settings` |
| `/organization/project-details/:id`                                   | Live                                            |
| `/organization/project-details/:id/leadership`                        | Live                                            |
| `/organization/project-details/:id/leadership/visits`                 | Live                                            |
| `/organization/project-details/:id/leadership/visits/:visitId/report` | Source only; requires a suitable live record    |
| `/organization/project-details/:id/management-of-change`              | Live                                            |
| `/organization/project-details/:id/risk-assessments`                  | Live                                            |
| `/organization/project-details/:id/risk-assessments/create`           | Live                                            |
| `/organization/project-details/:id/today-talk/create`                 | Live                                            |
| `/organization/project-employee/project/:project_id`                  | Live                                            |
| `/organization/project-equipment/project/:project_id`                 | Live                                            |
| `/organization/project-hierarchy/project/:project_id`                 | Live                                            |
| `/organization/project-meetings/:project_id`                          | Live                                            |
| `/organization/project-my-permits/:project_id`                        | Live                                            |
| `/organization/project-permit/create`                                 | Live                                            |
| `/organization/project-permit/project/:project_id`                    | Live                                            |
| `/organization/project-permit/project/templates`                      | Live                                            |
| `/organization/project-permit/project/templates-result`               | Live                                            |
| `/organization/project-permit/project/templates/answer`               | Live                                            |
| `/organization/project-permits/:project_id`                           | Live                                            |
| `/organization/project-progress`                                      | Live                                            |
| `/organization/project-summary/:id`                                   | Live                                            |
| `/organization/project-summary/:id/data/:resource`                    | Live                                            |
| `/organization/project-zone`                                          | Live                                            |
| `/organization/project-zone/:id`                                      | Live                                            |
| `/organization/project-zone/add`                                      | Live                                            |
| `/organization/project/:id`                                           | Live                                            |
| `/organization/project/add`                                           | Live                                            |
| `/organization/project/flow/:id?/:step?`                              | Live                                            |
| `/organization/projects`                                              | Live                                            |
| `/organization/role`                                                  | Live                                            |
| `/organization/role/:id`                                              | Live                                            |
| `/organization/role/add`                                              | Live                                            |
| `/organization/scope`                                                 | Live                                            |
| `/organization/scope/:id`                                             | Live                                            |
| `/organization/scope/add`                                             | Live                                            |
| `/organization/serial-number`                                         | Live                                            |
| `/organization/shifts`                                                | Live                                            |
| `/organization/shifts/:id`                                            | Live                                            |
| `/organization/shifts/add`                                            | Live                                            |
| `/organization/system-identity`                                       | Live                                            |
| `/organization/template`                                              | Live                                            |
| `/organization/template/:id`                                          | Live                                            |
| `/organization/template/add`                                          | Live                                            |
| `/organization/where-house`                                           | Live                                            |
| `/organization/where-house-type`                                      | Live                                            |
| `/organization/where-house-type/:id`                                  | Live                                            |
| `/organization/where-house-type/add`                                  | Live                                            |
| `/organization/where-house-type/upload`                               | Live                                            |
| `/organization/where-house/:id`                                       | Live                                            |
| `/organization/where-house/add`                                       | Live                                            |

### Source evidence for implementation

| Area                                     | Main implementation evidence                                                                                                                                                                              |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation and route scope               | `src/shared/LayoutComponents/organizationNavigation.ts`; `src/router/routes/organization/` and shared routes                                                                                              |
| Existing Home aggregates                 | `src/features/Home/data/Model/OrganizationDashboardModel.ts`; `presentation/composables/useOrganizationDashboard.ts`; `dashboardPermissions.ts`                                                           |
| CAPA source/task/verification            | `src/features/Organization/Capa/Data/models/IndexCapaModel.ts`, `ShowCapaDetailsModel.ts`, `CapaTasksModel.ts`; `Presentation/components/CapaActionPlanDetails.vue`; `Core/Core/*Enum.ts`                 |
| Internal audit lifecycle                 | `src/features/Organization/InternalAudit/Presentation/components/InternalAudit.vue`; `plan/`, `attendance/`, `ncrs/`, `reports/`, `my/` components/models; `Core/enums/`                                  |
| Projects and related operations          | `src/features/Organization/Project/Presentation/components/Details/ProjectSummary.vue`, `ProjectDetails.vue`; `Data/models/Leadership/`, `Drill/`, `ProjectLossTimeModel.ts`                              |
| Objectives                               | `src/features/Organization/objectives/Data/models/objectivesModel.ts`; `ObjectiveProgress/Data/apiServices/objectiveProgressContract.ts`; `ObjectiveProgress/Core/utils/objectiveProgress.ts`             |
| PPE and inductions                       | `src/features/Organization/Project/Data/models/ppematrix/` and `Induction/`; their route/view/form components                                                                                             |
| Workforce assurance                      | `src/features/Organization/OrganizationEmployee/Data/models/CertificateItemsModel.ts`; `Core/Enum/CertificateStatusEnum.ts`; `EmployeesCertificates/Presentation/components/IndexEmployeeCertificate.vue` |
| Organization assurance and configuration | Models/forms under `src/features/setting/` and `src/features/Organization/{Role,Scope,WhereHouse,Shifts,SerialNumber,notificationPlan,AttachmentMatrix,Herikaly}`                                         |
| Chart and identity persistence           | `src/features/SystemIdentity/dashboard.ts`; `components/IdentityDashboardEditor.vue`; `src/composables/useSystemIdentity.ts`                                                                              |
