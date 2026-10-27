# Organization dashboard: backend requirements

## Scope and decisions

This is a proposed implementation contract, not a statement that new endpoints exist. The frontend uses existing authenticated POST read endpoints. This repository contains the Vue client, not the Laravel server; database/table names below are suggested logical names to map to the actual backend schema.

The redesigned dashboard presents current returned counts, scope, review links, status comparisons, ownership and compact project records. It deliberately does not invent a safety score, historical trend, compliance denominator, workforce readiness percentage or investigation completion percentage.

Organization authorization must come from the authenticated tenant. Never trust a submitted `organization_id`. `project_id` must belong to that tenant and be accessible to the requesting user. Frontend hiding is not security.

## A. Existing backend capabilities

### Existing endpoint inventory

Paths are relative to the configured API base URL. All dashboard requests below are POST with the existing Bearer authentication and `Accept-Language` headers. The organization prefix is `organization/`; the common API-name class also has a separate dashboard/admin prefix.

| Existing route                                                           | Client source                                                                                 | Available fields                                                                                                                   | Scope / limitations                                                                                                                                                                    |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `organization/fetch_home_inspection_and_observations_statices`           | `Home/data/ApiService/FetchHomeInspectionApiService.ts`, `FetchHomeInspectionModel.ts`        | Incidents, high-risk observations, corrective actions, inspection counts, certificate counts, root causes, high-risk hazard groups | Accepts `project_id`; no date-range contract. Only `total_inspection_supposed_occured_this_month` explicitly states a month. Mixed permissions in one response.                        |
| `organization/fetch_home_observation_types_with_zones_statices`          | `OverviewHazardChartApiService.ts`, `OverviewHazardChartModel.ts`, `AllOpservionModel.ts`     | `zone_id`, `zone_title`, `all_observations.{hazard,accidents,observation}`                                                         | Categorical zone breakdown, not monthly history. Date basis, deduplication and status inclusions are unspecified.                                                                      |
| `organization/fetch_home_observations_investigations_statices`           | `OverviewInvestigationsChartApiService.ts`, `OverviewInvestigationsChartModel.ts`             | `zone_id`, `zone_title`, `total`                                                                                                   | `total` has no documented unit or denominator. The previous UI added `%`; the redesign does not request or plot this ambiguous measure. Investigation register navigation is retained. |
| `organization/fetch_home_equipments_statices`                            | `FetchEquipmentStaticsApiService.ts`, `EquipmentStaticsModel.ts`, `StatisticsMachineModel.ts` | `rent_and_owned_equipments.{rent,owned}`, `equipment_types_and_equipments_and_zones[].{title,total_equipments,equipment_types[]}`  | Inventory/assignment counts, not actual usage. Repeated equipment in multiple zones cannot be deduplicated from counts alone.                                                          |
| `organization/fetch_projects`                                            | `Project/Data/apiServices/indexProjectApiService.ts`, `ProjectModel.ts`                       | Project identity, lifecycle status, setup progress, incident/inspection/equipment/employee counts and assigned locations/zones     | `paginate`, `page`, `limit`, optional `project_id`. Scope of counts is not a dated analytics contract. The dashboard requests five records per page.                                   |
| `organization/fetch_project_statics_numbers`                             | `FetchProjectStaticsNumbersApiService.ts`                                                     | Additional legacy statistics service                                                                                               | No connected homepage controller/model contract was found; not silently added as a source.                                                                                             |
| Existing project-progress route through `IndexProjectProgressController` | `ProjectPrgoress/…`                                                                           | Configuration steps, progress, code-system mode                                                                                    | Organization setup assistance, not project safety performance. Preserved inline.                                                                                                       |

### Metric-level inventory

All values below are counts unless a different type is explicitly stated. `S` means the mixed summary endpoint, `Z` the zone-reports endpoint, `E` the equipment endpoint and `P` the projects endpoint above. Values are read directly; no historical change is inferred. All relevant aggregate requests carry the selected `project_id`, or omit it for the authenticated organization.

| Metric / source field                                                                                                                                             | Type / calculation                                                                      | Time basis                                         | Read access / frontend treatment                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Incidents — `S.total_incidents`                                                                                                                                   | Nonnegative integer, direct                                                             | Unspecified                                        | Incident read; headline count, not recordable injuries or a rate                                  |
| High-risk observations — `S.hazard_observations_high`                                                                                                             | Integer, direct                                                                         | Unspecified                                        | Observation/hazard read; not relabelled severe incidents or open hazards                          |
| Open corrective actions — `S.open_corrective_actions`                                                                                                             | Integer, direct                                                                         | Snapshot/open-state basis unspecified              | CAPA read; no overdue/closure-time inference                                                      |
| Total inspections — `S.total_inspection`                                                                                                                          | Integer, direct                                                                         | Unspecified                                        | Inspection read; not added to finished results                                                    |
| Claimed compliance — `S.inspection_compliance_percentage`                                                                                                         | Reported percentage                                                                     | Formula and denominator unspecified                | Intentionally not shown as verified compliance                                                    |
| Scheduled inspections — `S.total_inspection_supposed_occured_this_month`                                                                                          | Integer, direct                                                                         | Current month named in field; timezone unspecified | Inspection read; explicitly labelled scheduled this month                                         |
| Finished results — `S.total_finished_inspections_results`                                                                                                         | Integer, direct                                                                         | Unspecified                                        | Inspection read; results can differ in granularity from scheduled occurrences                     |
| Inspection states — `S.inspection_status.{new,in_progress,completed,canceled,delayed}`                                                                            | Five separate integers                                                                  | Unspecified                                        | Inspection read; independent bars, not a part-to-whole compliance chart; possible overlaps stated |
| Certificate total — `S.employee_certificates_status.total`                                                                                                        | Integer, direct                                                                         | Unspecified                                        | Employee-certificate read; records, not distinct employees                                        |
| Active/inactive/expired — `S.employee_certificates_status.{active,inactive,expired}`                                                                              | Three separate integers                                                                 | Unspecified                                        | Employee-certificate read; not summed into readiness; overlap unknown                             |
| Root-cause frequency — `S.most_used_root_causes[].{root_cause_id,root_cause_title,count}`                                                                         | Per-cause integer                                                                       | Unspecified                                        | Incident investigation context; optional top-five list, not a recurrence rate                     |
| Hazard grouping — `S.hazard_with_high_risk_observations[].{hazard_id,hazard_title,count}`                                                                         | Per-hazard integer                                                                      | Unspecified                                        | Hazard/observation context; available to adapter, not labelled active unmitigated risk            |
| Zone hazards — `Z[].all_observations.hazard`                                                                                                                      | Integer per zone                                                                        | Unspecified                                        | Hazard read; zone comparison                                                                      |
| Zone observations — `Z[].all_observations.observation`                                                                                                            | Integer per zone                                                                        | Unspecified                                        | Observation read; zone comparison                                                                 |
| Zone incidents — `Z[].all_observations.accidents`                                                                                                                 | Integer per zone                                                                        | Unspecified                                        | Incident read; zone comparison                                                                    |
| Investigation measure — `total`                                                                                                                                   | Unknown count/percentage semantics                                                      | Unspecified                                        | Investigation read; excluded pending a defined contract                                           |
| Owned / rented — `E.rent_and_owned_equipments.{owned,rent}`                                                                                                       | Separate counts; visual share = value / (owned + rent) only when both known and sum > 0 | Unspecified inventory snapshot                     | Equipment read; two mutually exclusive ownership enums; not utilization                           |
| Equipment by zone/type — `E.equipment_types_and_equipments_and_zones[].equipment_types[].{type,count}`                                                            | Integer by shared equipment IDs: equipment=1, device=2, tool=3                          | Unspecified                                        | Equipment read; absent categories stay unknown until server supplies explicit zero                |
| Zone equipment total — `…total_equipments`                                                                                                                        | Direct integer, not silently reconciled with category sums                              | Unspecified                                        | Available for reconciliation; no organization-wide unique-asset sum                               |
| Project incident / inspection / equipment / employee counts — `P.observation_accidents_count`, `inspections_count`, `equipment_count`, `assigned_employees_count` | Direct project metadata counts                                                          | Unspecified                                        | Project read; visible columns respect relevant module read access                                 |
| Project setup — `P.project_progress`                                                                                                                              | Supplied percentage in [0,100]                                                          | Configuration state                                | Project read; explicitly not safety performance                                                   |
| Project lifecycle — `P.status`                                                                                                                                    | Enum: active=1, completed=2, on-hold=3, canceled=4                                      | Current lifecycle                                  | Project read; not confused with setup-stage enum                                                  |
| Portfolio size — pagination `meta.total`                                                                                                                          | Integer from server, not current-page length                                            | Query scope                                        | Project read; selected-project display is restricted to that project                              |

Existing response envelopes use `{"status":true,"message":"…","data":…}` and optionally `data:{data:[],meta:{…}}`. Null/missing fields must not be converted to zero. The new dashboard adapter tolerates optional fields while retaining that distinction.

### Other implemented product modules relevant to future analytics

The repository includes CAPA/action statuses and verification, incident people/injury/fatality and near-miss data, severity/likelihood risk inputs, investigation teams/results, inspection schedules/results, employee certificates, role/position training requirements, equipment details including licenses/certificates and recorded worked hours, project summaries, safety objectives and progress, drill plans/results, inductions, permit-to-work, management of change, PPE matrices/deliveries, internal-audit plans/attendance/NCRs/reports, contractors, teams, locations and zones.

Relevant routes/services include `fetch_capas`, `fetch_capa_details`, `fetch_project_summary_details`, the inspection fetch/result services, investigation fetch/result services, objective progress services, `fetch_internal_audit_attendance`, audit NCR/report services and drill/induction services in `src/base/core/networkStructure/apiNames.ts`.

These are transactional capabilities. Their existence does **not** establish complete historical exposure hours, occurrence-level inspection denominators, organization-wide equipment utilization, general workforce timesheets or a maintenance-event analytics ledger. In particular, internal-audit attendance is not worked-hour exposure. No dedicated general maintenance analytics contract was found in this client.

## B. Missing critical capabilities — P0

1. **Metric definitions, scope and field-level permissions.** Supply reporting dates, tenant/project scope, as-of time, units, included/excluded statuses, distinct-record rules, completeness and definition versions. Split or permission-mask the current mixed summary. The frontend currently withholds that entire aggregate for users without all constituent read permissions.
2. **Trustworthy inspection occurrence accounting.** Define eligible scheduled occurrences, deadlines, completion/result granularity, cancellations and approved extensions. Provide numerator/denominator before displaying compliance.
3. **A real attention worklist.** Return authorized source-record links, owners, deadlines and severity. Current summary counts are not a work assignment list and do not establish unresolved critical risks.
4. **Investigation measure clarification.** Replace undocumented `total` with separate `opened`, `in_progress`, `closed`, `overdue` counts and explicit formulas/cohorts if closure percentages are required. Never append a percent sign to an untyped value.

## C. Recommended analytics and priorities

| Priority / capability                                        | Business question                                             | Current support / missing information                                                           | Visualization / endpoint                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| P0 / defined snapshot and inspection delivery                | What is pending, and are inspections delivered on time?       | Counts exist; periods, cohort definitions, eligibility and permission masking missing           | Executive KPIs and inspection activity — endpoint 1                |
| P0 / actionable exceptions                                   | What must someone act on next?                                | Registers exist; unified authorized owner/deadline worklist missing                             | Needs-review list — endpoint 2                                     |
| P1 / historical leading and lagging counts                   | Are signals changing, with enough context?                    | No homepage time series or matched prior period                                                 | Trend chart with count units — endpoint 3                          |
| P1 / comparable project workload                             | Which projects need investigation or follow-up?               | Project metadata exists; matched dates, denominators and due work missing                       | Compact project comparison — endpoint 4                            |
| P1 / exposure-based incident rates                           | How does classified injury frequency relate to exposure?      | Incident people exist; approved recordability classification and complete hours unavailable     | Rate trend with numerator/exposure disclosure — endpoint 5         |
| P1 / equipment and workforce assurance                       | Which current assets/people are missing required evidence?    | Certificates/requirements exist; current eligibility, deduplication and coverage rules missing  | Expiry queue, assurance counts and validated coverage — endpoint 6 |
| P2 / action effectiveness, recurrence, objectives and drills | Are controls effective and improvement commitments delivered? | Verification and objectives exist; comparable history and recurrence/cohort definitions missing | Follow-up outcome panels — endpoint 7                              |

A reported increase in hazards/near misses can reflect improved reporting rather than worse safety. The UI must not color every increase as negative. Incident-rate comparisons require matched populations, hours and classifications. No composite safety score is proposed. Leading and lagging measures should be interpreted together; see [OSHA leading-indicator guidance](https://www.osha.gov/leading-indicators).

## D. API contracts

### Rules applying to every proposed endpoint

- **Method and prefix:** authenticated POST `/organization/<name>` to match current read-API conventions. These are **new proposals**, not wired into production frontend requests yet.
- **Tenant:** resolve organization from the token/session; authorize `project_id` before querying. A null/omitted project means only projects accessible to that user within that organization.
- **Common historical request fields:** `project_id:int|null`, `start_date:YYYY-MM-DD`, `end_date:YYYY-MM-DD`, `timezone:IANA string`. Start/end are inclusive local calendar dates. Convert once to UTC `[local start 00:00, local day after end 00:00)`; never use fixed 24-hour additions across daylight-saving transitions. Default timezone comes from organization settings; echo the effective value.
- **Current-state requests:** explicitly use `as_of:ISO-8601 timestamp` (default server now) rather than silently mixing current status into historical reports. Reject unsupported past as-of reconstruction with 422, not current counts labelled historical.
- **Limits:** default historical range 30 days, maximum 366 days for synchronous endpoints. `interval:day|week|month` must be validated, with organization week-start policy echoed. Worklist lookahead max 90 days; page limit max 100.
- **Envelope:** `status:boolean`, localized `message:string`, `data:object|null`. Every successful response has `scope:{organization_id:int,project_id:int|null}`, effective period/as-of, `timezone:string`, `generated_at:ISO-8601 UTC`, `definitions_version:string`, `coverage:{complete:boolean,unavailable_reasons:string[]}`.
- **Metrics:** explicit `value:number|null`, `unit:count|percent|hours|days|cases_per_200k_hours|cases_per_1m_hours`, `basis:occurred|due|closed|as_of`, and `availability:available|no_eligible_records|incomplete|unsupported`. Omit unauthorized metric values completely and return an authorization-safe availability marker without counts or denominators. Never synthesize zero when coverage is incomplete or the denominator is zero.
- **Filters:** whitelist documented filters; reject unsupported filters with 422. Do not accept arbitrary sorting SQL or unknown entity types.
- **Authorization:** reuse existing module policies listed below, plus any dedicated analytics permission later introduced. Query and aggregate only authorized records; do not fetch all organization data and filter it after serialization.
- **Errors:** 401 unauthenticated; 403 unauthorized module or foreign/unavailable project; 422 invalid date/range/enum or unsupported historical reconstruction; 429 rate limited; 503 unavailable aggregation. Body: `{"status":false,"code":"DASHBOARD_INVALID_RANGE","message":"localized text","errors":{"end_date":["localized field error"]}}`. No SQL, tokens or stack traces. Failed partial domains may return explicit unavailable metrics; they must not masquerade as zero.
- **Consistency:** response totals and series share a single read snapshot/as-of. Scope, definitions and permission version are part of cache keys. Return `cache_age_seconds:int` or `data_updated_at` if served from a materialized aggregate.

### Endpoint 1 — defined executive overview (P0)

`POST /organization/fetch_organization_dashboard_overview`

Request:

```json
{
  "project_id": 12,
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "timezone": "Africa/Cairo",
  "comparison": "previous_period"
}
```

`comparison:none|previous_period`; previous period is the immediately preceding equal number of local calendar days. Current/open counts are explicitly as-of period end and require historical state support; otherwise mark unavailable.

Illustrative response (examples are contract fixtures, not real organization statistics):

```json
{
  "status": true,
  "message": "OK",
  "data": {
    "scope": { "organization_id": 5, "project_id": 12 },
    "period": {
      "start_date": "2026-01-01",
      "end_date": "2026-01-31",
      "start_utc": "2025-12-31T22:00:00Z",
      "end_exclusive_utc": "2026-01-31T22:00:00Z"
    },
    "timezone": "Africa/Cairo",
    "generated_at": "2026-02-01T08:00:00Z",
    "definitions_version": "hse-dashboard-v1",
    "coverage": { "complete": true, "unavailable_reasons": [] },
    "metrics": {
      "incidents": {
        "value": 7,
        "unit": "count",
        "basis": "occurred",
        "availability": "available",
        "distinct_by": "incident_id"
      },
      "open_high_risk_hazards": {
        "value": 2,
        "unit": "count",
        "basis": "as_of",
        "availability": "available"
      },
      "open_corrective_actions": {
        "value": 9,
        "unit": "count",
        "basis": "as_of",
        "availability": "available"
      },
      "overdue_corrective_actions": {
        "value": 3,
        "unit": "count",
        "basis": "as_of",
        "availability": "available"
      },
      "inspection_completion": {
        "value": 80,
        "unit": "percent",
        "basis": "due",
        "availability": "available",
        "numerator": 40,
        "denominator": 50
      },
      "inspection_on_time": {
        "value": 72,
        "unit": "percent",
        "basis": "due",
        "availability": "available",
        "numerator": 36,
        "denominator": 50
      }
    },
    "inspection_occurrences": {
      "eligible_due": 50,
      "completed": 40,
      "completed_on_time": 36,
      "overdue_unfinished": 10,
      "canceled_excluded": 2
    },
    "investigations": {
      "opened_in_period": 5,
      "open_as_of": 3,
      "closed_in_period": 2,
      "overdue_as_of": 1
    },
    "comparison": {
      "period": { "start_date": "2025-12-01", "end_date": "2025-12-31" },
      "metrics": {
        "incidents": { "value": 8, "absolute_change": -1, "relative_change_percent": -12.5 }
      }
    }
  }
}
```

All metric counts/numerators/denominators are nonnegative integers; percentages numeric in [0,100]. Relative change is null when prior value is zero, absent or incomparable; percentage-point change is distinct from relative percent change. Open hazards require a documented risk policy and unresolved status, not simply all observations marked high.

**Policies:** incident read for incidents; hazard/observation read for risk; inspection read for occurrence metrics; CAPA read for actions; investigation read for investigation counts. Partial permissions return partial metric availability, not denial of unrelated authorized metrics.

**Aggregation:** distinct event IDs and occurrence IDs, not multiplied joins to attachments, victims, teams or result answers. Date-range indexed scoped queries; materialize daily counts when necessary. Inspection delivery is based on due-occurrence cohorts; see section E.

### Endpoint 2 — actionable attention queue (P0)

`POST /organization/fetch_organization_dashboard_attention`

Request: `{"project_id":12,"as_of":"2026-02-01T08:00:00Z","lookahead_days":14,"types":["inspection","corrective_action","investigation","equipment_certificate","employee_certificate","high_risk_hazard"],"severity":"all","cursor":null,"limit":10}`.

`severity:all|critical|high|medium|low`, `cursor:opaque string|null`. Validate the type list; remove unauthorized types before querying. Stable ordering: severity priority, overdue descending, due timestamp ascending with null deadlines last, then source type/ID. Do not invent a deadline for a record without one.

Response `data` includes common scope/as-of metadata and:

```json
{
  "items": [
    {
      "id": "inspection:441:2026-02-01T06:00:00Z",
      "type": "inspection",
      "record_id": 441,
      "occurrence_id": 8201,
      "title": "Tower crane inspection",
      "project": { "id": 12, "title": "Project name" },
      "severity": "high",
      "status": "overdue",
      "due_at": "2026-02-01T06:00:00Z",
      "overdue_seconds": 7200,
      "owner": { "id": 41, "name": "Authorized display name" },
      "reason_code": "INSPECTION_OVERDUE",
      "navigation": { "feature": "inspection", "record_id": 441, "occurrence_id": 8201 }
    }
  ],
  "pagination": { "next_cursor": null, "has_more": false },
  "totals_by_type": { "inspection": 1 }
}
```

IDs are integers; stable queue `id` is a string. `occurrence_id`, `owner`, `due_at`, and overdue duration may be null. `totals_by_type` contains only authorized, identically scoped counts. Owner identity must respect employee visibility policies. Return typed navigation IDs, not arbitrary URLs; the frontend maps them to existing routes and rechecks access. Expired certificates are records; several certificates must not become an inflated count of employees.

**Policies:** corresponding source read/detail policies. One denied module must not hide unrelated authorized work. Fatality-linked employee deactivation must not erase historical incident analytics, and must not expose a deactivated person's private identity unnecessarily.

**Performance:** indexed due-date/status queries, bounded unions and cursor pagination; no N+1 owner/project queries; no global unpaginated operational list downloads.

### Endpoint 3 — safety count trends (P1)

`POST /organization/fetch_organization_dashboard_safety_trends`

Request: common historical fields plus `interval:day|week|month`, `measures:["incidents","near_misses","observations","hazards"]`, optional `severity:["high"]` and `category_ids:[int]`. Only apply severity/category filters to metrics with explicitly mapped taxonomies; reject incompatible mixes rather than silently dropping a filter.

Response `data` includes common metadata and:

```json
{
  "interval": "week",
  "week_starts_on": "monday",
  "basis": "occurred",
  "series": [
    {
      "start": "2026-01-01",
      "end_exclusive": "2026-01-05",
      "incidents": 2,
      "near_misses": 4,
      "observations": 12,
      "hazards": 3,
      "complete": true
    }
  ],
  "totals": { "incidents": 2, "near_misses": 4, "observations": 12, "hazards": 3 },
  "comparison": null
}
```

Date buckets are local date strings, first/last may be partial; ISO week numbering is optional metadata, not a fabricated month label. Emit explicit zero for a bucket only when collection coverage is complete; incomplete buckets have null measures and `complete:false`. Decide whether near misses are a disjoint incident category or an observation flag; expose `classification_version` so a near miss is not double-counted in totals without disclosure. Count distinct reports, not injuries/people or attachments. Use reported occurrence date, with a documented fallback for missing occurrence times and a count of fallback records.

**Policies:** per-series module policies. **Indexes:** `(organization_id, project_id, occurred_at, classification)` and immutable event-to-zone/project attribution; daily rollups by canonical category. Return at most 400 buckets. The frontend uses a line chart only when genuine time series exist, with a table alternative and explicit incomplete buckets.

### Endpoint 4 — comparable project analytics (P1)

`POST /organization/fetch_organization_dashboard_projects`

Request: common historical fields plus `page:int`, `limit:int<=50`, `sort_by:overdue_actions|overdue_inspections|incidents|title`, `sort_direction:asc|desc`. Scope follows the user's project allowlist; no arbitrary arbitrary-table sorting.

Response `data` includes common metadata and:

```json
{
  "rows": [
    {
      "project_id": 12,
      "title": "Project name",
      "titles": [{ "locale": "ar", "title": "اسم المشروع" }],
      "incidents": 7,
      "high_risk_open_hazards": 2,
      "overdue_actions": 3,
      "inspection": { "completed": 40, "eligible_due": 50, "completion_percent": 80 },
      "exposure_hours": null,
      "recordable_cases": null,
      "trir": null,
      "data_completeness": "partial"
    }
  ],
  "pagination": { "current_page": 1, "last_page": 1, "per_page": 5, "total": 1 }
}
```

Counts are nullable integers, exposure/rates nullable nonnegative numbers, translated titles are optional user/backend-supplied values. Null exposure/rates must not become zero. Projects with little exposure are not ranked safest by a tiny rate; rates expose sample sizes and minimum-exposure flags. Project setup progress remains a separate configuration field. Do not sum already paginated rows to produce organization totals.

**Policies:** project read plus metric-specific permissions; no denied values in sorting/ranking that leak hidden counts. **Performance:** pre-aggregate by project, join small metadata after aggregation, paginate in SQL, index tenant/date/project. Sorting counts requires exact counts across all accessible projects, not only the page.

### Endpoint 5 — exposure and classified incident rates (P1; requires data collection)

`POST /organization/fetch_organization_dashboard_incident_rates`

Request: common historical fields plus `interval:month`, `standard:osha_200k|organization_lti_policy`, `population:employees|contractors|combined`. The standard is selected from organization-approved policy, not arbitrary client multipliers. Echo effective policy version and whether fatalities are included in each numerator.

Response `data` includes common metadata and:

```json
{
  "standard": "osha_200k",
  "population": "combined",
  "policy_version": "org-approved-2026-v1",
  "exposure": {
    "worked_hours": 125000,
    "complete": true,
    "source": "approved_timesheets",
    "unallocated_hours": 0
  },
  "cases": { "recordable": 3, "lost_time": 1, "unclassified": 0 },
  "trir": {
    "value": 4.8,
    "unit": "cases_per_200k_hours",
    "numerator": 3,
    "denominator_hours": 125000,
    "scale": 200000,
    "availability": "available"
  },
  "ltifr": {
    "value": 8,
    "unit": "cases_per_1m_hours",
    "numerator": 1,
    "denominator_hours": 125000,
    "scale": 1000000,
    "availability": "available"
  },
  "days_since_last_lti": {
    "value": 21,
    "last_lti_date": "2026-01-10",
    "history_complete_from": "2025-01-01",
    "as_of": "2026-01-31"
  },
  "series": []
}
```

The example shows two explicitly different rate conventions; actual enabled metrics depend on approved policy. If worked hours are null/zero/incomplete, or classifications incomplete, rates are null with a reason; retain known counts separately. Do not estimate exposure from employee count, audit attendance or equipment `worked_hours`. Deduplicate a worker's overlapping timesheets and allocate multi-project hours once. Worker population, tenant, dates and work-related case population must match.

**Policies:** incident analytics plus approved aggregate-exposure access; do not expose payroll/person-level timesheets in dashboard JSON. **Indexes:** unique timesheet source ID and `(organization_id,project_id,work_date,population)`, case classification effective history and event occurrence. Pre-aggregate approved hours daily; version corrected rollups.

### Endpoint 6 — equipment and workforce assurance (P1)

`POST /organization/fetch_organization_dashboard_assurance`

Request: `project_id`, `as_of`, `lookahead_days:1..90`, `domains:["equipment","workforce"]`, optional `equipment_type_ids:[int]` only for equipment and `position_ids:[int]` only for workforce. Unsupported cross-domain filters must be rejected or explicitly scoped under a domain object.

Response `data` includes common metadata and:

```json
{
  "equipment": {
    "unique_active_assets": 100,
    "inspection": { "required_assets": 80, "current_assets": 72, "overdue_occurrences": 10 },
    "certificates": { "expired_assets": 5, "expiring_assets": 7, "missing_required_assets": 2 },
    "maintenance": { "availability": "unsupported", "due_assets": null, "overdue_assets": null }
  },
  "workforce": {
    "eligible_employees": 120,
    "requirements_known_employees": 118,
    "ready_employees": 100,
    "required_assignments": 260,
    "valid_assignments": 230,
    "expired_assignments": 16,
    "missing_assignments": 14,
    "training_coverage_percent": 88.4615
  },
  "unknown_requirements": { "employees": 2, "equipment": 0 },
  "upcoming": [
    {
      "type": "equipment_certificate",
      "record_id": 51,
      "equipment_id": 9,
      "expires_at": "2026-02-06T21:59:59Z"
    }
  ]
}
```

Domains are independently permission-masked. Counts are integer/null; unknown eligibility/requirements produce explicit incomplete coverage, not automatic ready status. Asset counts are deduplicated by equipment ID across zones. Employee readiness is computed over current required employee×training/certificate assignments, not certificate-file totals. Expiry date-only values remain valid through the organization's local expiry date; normalize to an exclusive boundary internally. Revoked/inactive evidence cannot satisfy a requirement unless policy explicitly permits it. Historical project assignments need effective-from/to dates for past as-of requests.

Maintenance metrics remain unsupported until actual maintenance schedules/completions and availability periods exist. Equipment recorded worked hours alone are not utilization: availability/operating windows and counter-reset history are required.

**Policies:** equipment read; employee-certificate and applicable training read. Worklist item detail policies still apply. **Indexes:** current asset assignments, `(organization_id, asset_id, certificate_type, expires_at)`, `(organization_id, employee_id, requirement_id, valid_from, expires_at)`, requirement versions by position and project. Averages must not combine duplicate evidence uploads as separate requirements.

### Endpoint 7 — improvement outcomes (P2)

`POST /organization/fetch_organization_dashboard_improvement_outcomes`

Request: common historical fields plus `domains:["capa","objectives","drills","internal_audit"]`, `cohort:due_in_period|closed_in_period` where applicable, `recurrence_window_days:30..365` only for recurrence metrics. Return each domain's cohort explicitly.

Response `data` includes common metadata and:

```json
{
  "capa": {
    "due_cohort": { "eligible": 20, "closed": 16, "closed_on_time": 13, "closure_percent": 80 },
    "closed_cohort": {
      "count": 16,
      "average_resolution_hours": 34.5,
      "median_resolution_hours": 22.0,
      "p90_resolution_hours": 80.0
    },
    "effectiveness": { "assessed": 10, "effective": 8, "percent": 80 },
    "repeat_findings": { "count": null, "availability": "unsupported" }
  },
  "objectives": { "due_occurrences": 8, "achieved_occurrences": 6, "unknown_progress": 1 },
  "drills": { "planned_due": 5, "completed": 4, "completed_on_time": 3 },
  "internal_audit": { "plans_due": 3, "reports_completed": 2, "open_major_ncrs": 1 }
}
```

Do not average unlike objective targets or sum percentages with different denominators. Respect objective direction (increase/decrease), target type (number/percent), baseline and occurrence schedule. Completion is not effectiveness: only explicit verification/assessment with a result belongs in the effectiveness denominator. Reopened actions need a defined resolution episode; use final verified resolution for the selected closed cohort and retain reopen history. Recurrence requires an approved shared finding taxonomy, matching scope and time rule; same free-text wording is insufficient.

**Policies:** CAPA/task verification, objectives, drills and internal-audit read separately. **Performance:** versioned status history and occurrence rollups; index tenant/project/due/closed/taxonomy. Return null metrics for domains without adequate history.

## E. Calculation definitions

| Metric                        | Definition / required population                                                                                                                                                                                                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Incident count                | Distinct incident IDs with occurrence timestamp in the requested period and authorized scope. Not injured-person count.                                                                                                                                                                       |
| High-risk open hazard count   | Distinct unresolved hazard IDs as-of the stated instant meeting the approved severity×likelihood policy/version; excluded closed/canceled status codes explicitly listed.                                                                                                                     |
| Inspection completion         | 100 × completed eligible scheduled occurrences / eligible occurrences due in the period. Completion requires an accepted result under the organization policy. Zero denominator → null.                                                                                                       |
| On-time inspection completion | 100 × eligible due occurrences completed no later than the applicable versioned deadline / eligible due occurrences. Approved extensions are audited; no unrecorded deadline edits.                                                                                                           |
| Overdue inspection rate       | 100 × unfinished eligible occurrences with deadline < as-of / eligible occurrences due up to as-of in the stated cohort. Do not divide by all future schedules.                                                                                                                               |
| Open / overdue CAPA           | Distinct actionable CAPA/task IDs in explicit open states; overdue additionally has due_at < as_of. Preventive and corrective tasks can be separate; define which is counted.                                                                                                                 |
| CAPA due-cohort closure       | 100 × closed eligible actions due in the period / eligible actions due in the period. Keep closed-in-period throughput separate.                                                                                                                                                              |
| Average resolution time       | Sum(final verified resolved_at − action_created_at in elapsed hours) / number of eligible resolved actions in the closed cohort. Null dates and negative intervals are quality failures; unresolved actions do not enter a resolved-only average. Show median/p90 and pending age separately. |
| Effectiveness                 | 100 × actions explicitly verified effective / actions with completed effectiveness assessment, not all closed actions.                                                                                                                                                                        |
| Training coverage             | 100 × currently satisfied required employee×requirement assignments / required assignments for eligible active workers. Multiple evidence files per requirement count once. Unknown requirements are not automatic compliance.                                                                |
| Employee readiness            | Distinct eligible employees satisfying all current mandatory requirements, with known requirement policy; report count and eligibility/unknown counts separately.                                                                                                                             |
| Equipment inspection coverage | 100 × eligible unique assets with all required current inspection evidence / unique eligible assets requiring inspection. Distinct from an occurrence completion rate.                                                                                                                        |
| Days since last LTI           | Organization-local calendar date difference between as-of date and last qualifying LTI occurrence. No known baseline/history → null; never claim unlimited injury-free days from absent data.                                                                                                 |

### Injury-rate standards

For an OSHA-style total-recordable rate, use `recordable cases × 200,000 / actual worked hours` for a matched worker population and period. Classify recordable injury/illness cases; a generic incident total is not that numerator. The U.S. convention is not automatically an applicable Egyptian or organization reporting standard. [OSHA rate definition](https://www.osha.gov/itadata), [OSHA interpretation and small-sample caution](https://www.osha.gov/laws-regs/standardinterpretations/2016-08-23).

For an organization-approved lost-time frequency convention, `qualifying new lost-time cases × configured scale / matched worked hours`; explicitly declare a 1,000,000-hour scale when that policy is selected. Definitions and fatality inclusion vary by standard. [ILO's documented Spanish series](https://webapps.ilo.org/ilostat-files/SSM/SSM8/E/ES.html) illustrates a million-hour convention, not a universal requirement. Regulatory and HSE owners must approve the actual policy before enabling rates.

Rate thresholds are organization-specific; no universal red/green cutoffs or project safety rankings are specified. Compare like populations with adequate exposure. Historical corrections must revise both numerator and exposure coverage.

## F. Database and historical requirements

Suggested logical entities; map names to the real Laravel schema before implementation:

- `analytics_definition_versions`: units, formulas, states, timezone, denominator and policy version, effective dates, owner approval.
- `inspection_occurrences`: organization/project/task IDs, scheduled/due UTC, original/applicable due dates, cancellation time/reason, assigned entity, completion/result IDs, accepted_at, deadline-extension audit. Unique task+scheduled-occurrence key prevents recurrence double-counting.
- `status_transitions`: entity type/ID, prior/next status, happened_at, actor, reason and tenant/project attribution. Required for honest past as-of counts and reopened action episodes.
- `injury_cases`: incident/person-case ID, work-related determination, recordable status, lost-time determination, occurrence time, population, standard/version and classification audit. Retain historical links when a fatality causes employee deactivation or hiding; use soft deletion/anonymized aggregates rather than cascading away history.
- `exposure_hours_daily`: organization/project/work date, worker population, source ID, approved actual hours, allocation and correction version. Decimal precision, uniqueness and overlap validation; do not infer hours from staffing counts.
- `requirement_assignments` / `evidence_validity`: employee/asset requirement IDs, project/position effective dates, mandatory rule version, evidence validity and revocation. Keep date-only expiry semantics explicit.
- `equipment_assignment_history`: unique asset ID, zone/project and effective dates. Unique-assets queries deduplicate multiple assignments.
- `maintenance_occurrences` / `equipment_operating_periods`: only when actual maintenance/availability data collection is introduced. Capture due/completed/failure/downtime start/end and counter resets; do not backfill fabricated usage.
- `analytics_daily_rollups`: tenant/project/date/metric/policy version/population, count or numerator/denominator, complete flag, refreshed_at. Unique dimensional key and idempotent rebuilds. Retain raw events for reconciliation.

Indexes should start with organization/project scope and the relevant occurrence/due/closed/expiry date. Add selective status/type dimensions based on query plans, not indiscriminate indexes on every field. Use `EXPLAIN`, representative tenant sizes and authorization-filtered joins. Avoid counting joins before deduplication.

## G. Prioritized roadmap

### P0 — trust and actionability

1. Agree definitions with HSE and backend owners, especially inspections, investigation `total` and mixed-summary permissions.
2. Add endpoint 1 with precise scope/period/completeness and occurrence denominators; retain old routes for compatibility.
3. Add endpoint 2 with genuine source IDs, due dates, owners and permitted drill-down metadata.
4. Add contract tests, scoped aggregation indexes and shadow reconciliation against existing registers. Historical metrics remain unavailable until history is complete.

### P1 — explanation and assurance

5. Add true time-series endpoint 3 and project comparison endpoint 4 after event-time and attribution definitions are approved.
6. Add assurance endpoint 6 using current requirements/evidence, and deduplicate people/assets.
7. Introduce approved exposure-hour collection and case classification, then endpoint 5. Rate calculations must wait for complete denominators, not block the current count dashboard.

### P2 — improvement and personalization

8. Add outcome endpoint 7 after status/verification history is available.
9. Consider saved filters, role-specific panel preferences and exportable reports only after permission/version-aware responses are stable. These are frontend/product enhancements, not new analytics endpoint proposals here.

## H. Frontend integration plan

| Backend milestone    | Frontend change                                                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Defined overview     | Replace returned-snapshot notice with effective period/as-of labels; enable genuine date filtering and comparison only for supported metrics; render verified inspection numerator/denominator. |
| Attention queue      | Replace count-level review links with owned, due, severity-sorted source-record work items and pagination.                                                                                      |
| Safety trends        | Add an actual time-series panel with local-calendar buckets, comparison semantics and incomplete-data gaps. Keep current categorical zone comparison as a separate view.                        |
| Project analytics    | Extend the compact portfolio with matched-period overdue work and justified denominators; do not introduce an opaque health score.                                                              |
| Incident rates       | Add opt-in standard-labelled rates, worked hours, case counts, policy version and coverage. No rates when unavailable.                                                                          |
| Assurance            | Add expiry windows and required-assignment coverage. Keep evidence-record counts distinct from employee readiness.                                                                              |
| Improvement outcomes | Add verified closure/response-time and objective/drill/NCR summaries when cohorts and histories are complete.                                                                                   |

Adapters belong in `Home/data/Model`, authenticated services in `Home/data/ApiService`, repositories/use cases under `Home/domain`, and presentation state in the dashboard composable/controller. Replace individual sources progressively; do not alter unrelated module request contracts. New APIs need fixture and live read-only reconciliation before adoption.

## I. Ready-to-implement backend tasks

Each task below references the full request/response specification in section D; the task is incomplete unless that schema, common metadata/error rules and tenant policies are implemented.

### Task P0-1 — versioned dashboard overview

- **Goal:** trustworthy executive counts and inspection delivery without mixed-permission leakage.
- **Existing modules:** incident/observation/hazard, inspection schedules/results, CAPA/tasks, investigations and projects.
- **Endpoint/schema:** endpoint 1. Accept project/date/timezone/comparison; return metric value/unit/basis/availability, occurrence numerator/denominator, investigation counts, common metadata and optional comparison.
- **Rules:** implement section E due-occurrence formulas, distinct IDs, versioned as-of statuses, separate incident versus person-case counts. Mask unauthorized metric fields before aggregation/serialization.
- **Acceptance:** totals reconcile to authorized registers for identical filters; zero and null are distinct; unknown history is unavailable; changing tenant/project cannot expose foreign data; previously ambiguous investigation measures are explicit counts.
- **Edges/tests:** no occurrences, all canceled, deadline extension, late cancellation, duplicate results/attachments, reopening, missing occurrence time, cross-midnight/DST, foreign project, partial permissions, prior period zero, definition change. Laravel feature tests assert JSON types and count leakage; query-count and large-tenant tests enforce bounded queries.

### Task P0-2 — operational attention worklist

- **Goal:** managers can assign follow-up from actual overdue/expiring/high-risk records.
- **Modules:** inspections, CAPA, investigations, employee/equipment certificates, hazards.
- **Endpoint/schema:** endpoint 2; project/as-of/lookahead/type/severity/cursor/limit; typed source IDs, title, owner, due_at, reason_code, safe navigation metadata and authorized totals.
- **Rules:** deterministic priority and cursor ordering, true unresolved status, no invented deadlines. Return current authorized owner only; null owner is unassigned.
- **Acceptance:** every item resolves to an accessible existing source record; expired documents are not inflated into unique employee counts; partial domain permission does not reveal hidden totals.
- **Edges/tests:** unassigned work, no due date, deleted/deactivated owner, repeated occurrence, equal deadlines, cursor mutation, certificate expiry at local midnight, tenant isolation, unsupported past as-of and lookahead bounds. Assert no arbitrary URL navigation and no N+1 queries.

### Task P1-1 — genuine safety trends

- **Goal:** distinguish changes over time from zone distributions.
- **Modules:** observations, hazards, incidents and near-miss classification.
- **Endpoint/schema:** endpoint 3 with project/dates/timezone/interval/measures and supported severity/category filters; series bounds, complete flags, totals and classification version.
- **Rules:** distinct events by occurrence time; materialize explicit zero only for complete buckets; define near-miss overlap; sum displayed buckets to scoped totals under the same snapshot.
- **Acceptance:** first/last partial buckets and weeks crossing years are correct; no fallback month labels for zone names; unknown historical coverage is a gap, not zero.
- **Edges/tests:** leap day, DST, empty full-coverage periods, missing coverage, late event corrections, deleted historical projects, taxonomy migrations and overlapping filters. Rollup rebuild tests must be idempotent.

### Task P1-2 — comparable project table

- **Goal:** project review based on dated workload and delivery, without arbitrary scores.
- **Modules:** project assignment history, incident/hazard, CAPA, inspections and optional exposure.
- **Endpoint/schema:** endpoint 4; historical filters, validated sorting/pagination; rows with period counts, overdue work, numerator/denominator and completeness.
- **Rules:** aggregate before pagination and metadata joins; source all rows/totals from the user's accessible project set; hide denied measures from output and sorting.
- **Acceptance:** sorting is across the whole accessible cohort; null exposure does not become a zero rate; project setup remains separate; pagination total matches accessible rows.
- **Edges/tests:** no projects, one project, dozens/hundreds, long bilingual titles, moved assignments, mixed permissions, identical sort values, missing denominators and multi-project duplicate joins. Benchmark stable query counts across project volume.

### Task P1-3 — equipment and workforce assurance

- **Goal:** identify current required-evidence gaps and genuine upcoming expiry work.
- **Modules:** equipment/assignments/licenses/certificates, employees, position/training requirements, evidence validity; future maintenance schedules only if implemented.
- **Endpoint/schema:** endpoint 6, independently masked equipment/workforce domains; current-as-of requirement totals, valid/expired/missing counts, unknown requirements and typed upcoming items.
- **Rules:** unique assets, unique employee×requirement assignments, latest valid nonrevoked evidence, effective-date assignments and explicit expiry boundaries. Maintenance is unsupported until real data exists.
- **Acceptance:** duplicate uploads do not improve coverage; multiple zone assignments do not inflate unique assets; zero known requirements do not establish readiness; inactive/fatality-hidden employees preserve history but leave current eligibility according to policy.
- **Edges/tests:** missing requirement policy, overlapping valid certificates, expiring today, revoked evidence, rental interval boundaries, historical reassignment, multiple projects, inactive employees and denied domains. Validate coverage numerator/denominator consistency and no private evidence URLs in analytics aggregates.

### Task P1-4 — exposure ledger and injury-rate reporting

- **Goal:** enable defensible standardized rates after required data collection is reliable.
- **Modules:** incident affected-person cases, work-related/recordable/LTI classifications, approved workforce/project exposure hours; equipment hours and audit attendance are explicitly excluded as substitutes.
- **Endpoint/schema:** endpoint 5 plus the underlying approved exposure ingestion workflow to be designed with the owning backend team. Rate requests use project/dates/timezone/interval/approved standard/population; return numerator, denominator, scale, policy and completeness.
- **Rules:** section E formulas, matched worker populations, distinct qualifying cases, actual approved hours, unique source records and correction history. Never derive recordable cases directly from `total_incidents`.
- **Acceptance:** reproducible known fixtures calculate expected rates; null/zero/incomplete exposure and incomplete classifications disable rates; policy multipliers are server-controlled and clearly labelled.
- **Edges/tests:** two injured people in one incident, employees/contractors, overlapping timesheets, cross-project allocation, zero hours, backdated corrections, fatalities, no last-LTI baseline and policy changes. Add tenant and payroll-privacy tests. HSE-owner approval is required before enabling jurisdiction-specific rates.

### Task P2-1 — verified improvement outcomes

- **Goal:** report action effectiveness and meaningful objectives/drill/audit outcomes.
- **Modules:** CAPA status transitions and verification, objectives/progress, drills and internal-audit NCR/report history.
- **Endpoint/schema:** endpoint 7 with domain/date/cohort filters; explicit due/closed cohorts, resolution-time distributions, verified effectiveness and objective/drill/NCR counts.
- **Rules:** distinguish due-cohort closure from closed throughput; define reopened episodes; only assessed actions enter effectiveness; respect objective target type/direction/baseline and scheduled occurrences. Recurrence stays unsupported until shared taxonomy exists.
- **Acceptance:** closed but unverified actions never imply effective controls; unresolved cases do not bias a resolved-only average invisibly; mixed objective percentages are not averaged into an invented score.
- **Edges/tests:** reopened and canceled actions, missing verified_at, decreasing targets, annual/periodic objectives, partial attendance, repeated findings, definition migrations and partial domain permissions. Reconcile cohort fixtures to source audit trails.

## Reconciliation and rollout gates

Before replacing an old source, run old and new counts in shadow mode for representative tenants and identical scopes. Investigate differences rather than forcing equality where old definitions were wrong. Publish approved definitions and migrations, monitor aggregation latency/error/coverage, and keep new metrics behind explicit availability until their source data is reliable. No new endpoint described here has been silently mocked or added to production by this frontend task.

## J. Approved-design activity feed contract (P1)

The approved concept includes a chronological activity panel. Current user notifications are not a trustworthy substitute for a tenant/project activity ledger: notification delivery, personal permissions and event deduplication have different semantics. The frontend currently offers permitted register navigation with an explicit unavailable-timeline message; it creates no event items, timestamps or fake relative dates.

### Endpoint 8 — organization activity timeline

**Proposed:** `POST /organization/fetch_organization_dashboard_activities`. Apply all common tenant, timezone, envelope, error and field-level authorization rules in section D.

Request:

```json
{
  "project_id": 12,
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "timezone": "Africa/Cairo",
  "types": [
    "incident_reported",
    "observation_created",
    "inspection_scheduled",
    "inspection_completed",
    "corrective_action_updated",
    "investigation_closed"
  ],
  "cursor": null,
  "limit": 10
}
```

Response `data` includes the common metadata plus:

```json
{
  "items": [
    {
      "event_id": "evt_01JEXAMPLE",
      "event_type": "inspection_completed",
      "occurred_at": "2026-01-31T09:12:00Z",
      "record": { "type": "inspection", "id": 441, "title": "Authorized record title" },
      "project": { "id": 12, "title": "Authorized project name" },
      "actor": { "id": 41, "display_name": "Authorized employee" },
      "summary_key": "inspection_completed",
      "summary_parameters": { "record_title": "Authorized record title" },
      "navigation": { "feature": "inspection", "record_id": 441 }
    }
  ],
  "pagination": { "next_cursor": null, "has_more": false }
}
```

- `event_id` is an immutable unique string; IDs are positive integers; `actor`, `project` and `record.title` may be null when policy permits the event but not personal metadata. Never leak private titles through a generic translated summary.
- Whitelist event/summary keys; return typed parameters and navigation metadata. The frontend owns translated system phrases and preserves user-entered titles. Arbitrary HTML or redirect URLs are not accepted.
- Sort by `occurred_at DESC,event_id DESC`; cursor-encode both. Backdated source events and corrections need an explicit event policy, not an undocumented `updated_at` guess. Deduplicate repeated notification deliveries by event ID.
- Source the ledger from committed domain events using an idempotent outbox/transactional job. Do not infer a historical event stream from current status alone. Retain source deletion/inactivation history without exposing prohibited personal information.
- Filter project membership and the relevant source module/detail policy **before** pagination. Omit inaccessible items; never return hidden-event totals. Organization activity is not a company-wide employee surveillance feed.
- Suggested indexes: `(organization_id,project_id,occurred_at,event_id)` and unique `(organization_id,source_event_id)`. Bound query count, eager-load authorized small metadata and cache by scope, event-type set, permission version and cursor.

### Ready-to-implement task P1-5

**Goal:** populate `DashboardActivities.vue` with real, authorized chronological source events. **Existing modules:** incidents, observations, inspection schedules/results, CAPA and investigations. Implement endpoint 8 and its full request/response schema above, plus the idempotent event ledger. **Acceptance:** correct chronological/cursor ordering, real source navigation, translated summary keys, no duplicates, no invented events, and no unauthorized metadata. **Tests:** same-timestamp events, cursor continuation, project switches, duplicate outbox deliveries, source deletion, missing actor, old events with late commits, empty feeds, localized summaries, foreign-project queries and partial module permissions. Do not backfill fictional timestamps.

### Approved-design adaptations

- Historical line chart: use endpoint 3 when implemented; the current UI uses an accurately labelled location comparison.
- Inspection/training donuts: remain independent counts until the backend guarantees a mutually exclusive cohort and supplies matching denominators.
- Corrective completion ring: the current accented count tile shows open actions only. Endpoint 1/7 must supply total/closed/cohort before rendering a completion percentage.
- Most-reported cases: the current endpoint supplies root-cause counts, so the ranking uses those real categories rather than screenshot labels.
- Equipment donut: uses the aggregate owned/rented fields, never sums zone assignments to claim unique equipment. Confirm unique-equipment semantics and explicit unclassified counts in the defined overview/assurance contract.
- Critical reminders: current UI shows reported high-risk observations, delayed inspections and expired certificate records, without fabricated deadlines or unresolved-risk claims. Endpoint 2 enables genuine owner/deadline-specific reminders.
- Quick CAPA action: the existing router has a CAPA register/details workflow and no standalone generic CAPA-create route. The quick action opens management of corrective actions rather than an invented route.


## K. Visual correction integration constraints

The visual acceptance correction keeps existing API values and transport behavior unchanged. `DashboardCategoryChart.vue` presents **categorical work-zone** comparisons, not temporal trends. Its axis starts at zero and unknown values remain distinguishable from real zero. Independent certificate bars and inspection status bars express counts relative to the largest displayed count; their widths are not compliance or completion percentages.

Unsupported closed/overdue CAPA counts and chronological activities are no longer rendered as large placeholders. `DashboardCorrective.vue` presents the one supported open-action count. `DashboardActivities.vue` is temporarily an accurately named compact operational-register navigator. After endpoint 8 exists, introduce the real timeline with timestamps and permission-filtered events; do not relabel these navigation links as recent activity. No new backend work is needed to use the corrected frontend.

Highest-value next integrations remain:

1. **P0 — Defined scoped overview:** exact units, period/as-of metadata, server authorization masking, null/coverage semantics, and unique ownership aggregation.
2. **P1 — Historical safety series:** actual event-date buckets and comparable period coverage; unlock reference-quality trend lines and genuine comparisons.
3. **P0/P1 — Inspection and CAPA cohorts:** occurrence/result relationships, matched denominators and explicit closed/open/overdue definitions; unlock trustworthy compliance and completion visuals.
4. **P0 — Authorized attention worklist:** source IDs, responsible people, status and actual deadlines; unlock urgent record-level reminders.
5. **P1 — Committed activity ledger:** idempotent source events, chronological cursors and field-level permission filtering; unlock a real recent-activity timeline.

Use the detailed contracts and acceptance tests above for implementation. No fabricated events, inferred dates, invented rates or fixture endpoints should be added to production to fill the reference layout.

## L. Historical incidents, hazards and observations line chart — integration contract

The current `fetch_home_observation_types_with_zones_statices` response is categorical: `zone_id`, `zone_title`, and `all_observations.{accidents,hazard,observation}`. It contains no dates. The grouped chart uses these exact count fields. It cannot supply the approved historical line chart. Do not reinterpret locations as months or distribute totals across invented dates.

### Suggested endpoint and parameters

Implement **`POST /organization/fetch_organization_dashboard_safety_trends`**, extending endpoint 3 above. Follow the existing authenticated read-POST convention. The following are logical query/filter parameters, serialized as a JSON request body to match this application:

| Parameter | Type | Rules |
| --- | --- | --- |
| `project_id` | positive integer or null | One authorized project; omitted/null means the user's authorized organization-wide project scope. |
| `start_date` | `YYYY-MM-DD` | Inclusive local start date. |
| `end_date` | `YYYY-MM-DD` | Inclusive local end date; maximum synchronous range 366 days. |
| `interval` | `day`, `week`, `month` | Stable chronological calendar buckets; default `week`. |
| `timezone` | IANA string | Default organization timezone; validate and echo effective timezone. |
| `measures` | array of enums | `incidents`, `hazards`, `observations` for this chart. |

Organization filtering is mandatory and derived from the authenticated tenant. Return `scope.organization_id`; **do not trust a caller-supplied organization ID**. Reject foreign project access. Optional future multi-project filtering must intersect the authorized project allowlist before aggregation.

Illustrative contract only, not application data:

```json
{
  "project_id": null,
  "start_date": "2026-10-01",
  "end_date": "2026-10-31",
  "interval": "week",
  "timezone": "Africa/Cairo",
  "measures": ["incidents", "hazards", "observations"]
}
```

```json
{
  "status": true,
  "message": "",
  "data": {
    "scope": { "organization_id": 1, "project_id": null },
    "period": { "start_date": "2026-10-01", "end_date": "2026-10-31" },
    "timezone": "Africa/Cairo",
    "interval": "week",
    "week_starts_on": "monday",
    "basis": "occurred",
    "generated_at": "2026-11-01T00:00:00Z",
    "definitions_version": "safety-counts-v1",
    "coverage": { "complete": false, "unavailable_reasons": ["example_incomplete_bucket"] },
    "series": [
      { "start": "2026-10-01", "end_exclusive": "2026-10-05", "incidents": 0, "hazards": 0, "observations": 0, "complete": true },
      { "start": "2026-10-05", "end_exclusive": "2026-10-12", "incidents": null, "hazards": null, "observations": null, "complete": false }
    ],
    "comparison": null
  }
}
```

The sample series is deliberately abbreviated. A real response must cover the entire requested range with explicit bucket bounds and completeness; it must not omit intervening buckets.

### Date grouping and calculation rules

- Group by canonical occurrence time, not last-update time or equipment assignment date. Document the existing domain-specific occurrence field and a deliberate fallback policy; expose how many records used a fallback.
- Use distinct report IDs per system classification. Join multiplication from witnesses, injuries, zones, attachments or CAPA records must not increase report counts. Preserve the existing incident/hazard/observation taxonomy and expose its version.
- Convert the inclusive local range to a half-open UTC interval using the effective timezone. Respect daylight-saving transitions. Week boundaries follow the echoed organization policy; month buckets follow calendar months. Clip first/last buckets to the requested range.
- `0` means a verified empty bucket with complete collection coverage. `null` means unknown/incomplete; the frontend must show a line gap, never interpolate it as zero. Missing/unavailable domains must not leak unauthorized counts.
- Each series value is a count, not a percentage or exposure-adjusted injury rate. Comparison percentages require actual matched prior-period data and explicit zero-denominator rules.

### Permissions, performance and acceptance

Require the existing incident, hazard and observation module read policies independently (`*_ALL` or `*_FETCH` families used in `dashboardPermissions.ts`). Filter by organization, allowed projects and record-level policies **before** aggregation. If a requested series is unauthorized, omit its values and return a safe availability marker; deny a request with no authorized series. Use the shared 401/403/422/429/503 error contract above.

Index canonical event tables by `(organization_id, project_id, occurred_at)`; use classification-aware daily rollups if needed, keyed by tenant, project, interval, timezone, permission scope and definition version. Do not cache one user's broader scope for another user.

Acceptance tests: zero-event complete period, missing coverage, one bucket, month/year boundary, DST transition, partial first/last week, deleted/canceled record policy, join deduplication, foreign organization/project, partial permissions, null project, invalid dates, concurrent record updates and totals reconciled against authorized source registers.

Once this endpoint exists, add a separate multi-series **historical line chart** using `#F04452`, `#F59E0B` and `#2864F0`, locale-aware date ticks, count axis, shared tooltips and explicit gaps. Keep the grouped location comparison as its own categorical view. Until then, no historical chart or date filter is rendered with invented data.
