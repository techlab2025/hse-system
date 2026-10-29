# HSE Demo Setup Report

Verified on 28 October 2026 against the live application.

## Organization Summary

- **Organization:** Mesopotamia Energy Services & Petroleum Operations [DEMO].
- **Arabic demo identity:** شركة بلاد الرافدين لخدمات الطاقة والعمليات النفطية. The organization-name form exposes a single name; Arabic was populated where bilingual operational fields exist.
- **Organization ID:** 13. Subscription application reference: 11.
- **Approval:** Approved, confirmed in the admin workflow. The user approved the existing demo application and supplied its account; this execution did not submit a second registration or approve an unrelated application.
- **Login:** https://sys.hse.techlabeg.com/organization. Fresh normal organization login verified the organization ID, account type, and renamed organization.
- **Industry:** ISIC Rev.4 B, Mining and quarrying, the available match for petroleum operations. Operational locations are under the Iraq hierarchy. The profile country association needs separate correction; admin details returned an empty locations array after country selection.
- **Subscription:** Approval and usable account verified. A specific package, subscription ID, billing state, and organization-to-subscription association were not exposed sufficiently to verify.
- **Classification:** Entire dataset is fictional software demonstration data. No real incident, employee, certification, regulatory compliance, physical inspection, or field work is asserted.

The supplied account originally displayed “Hse Compnay”. Only this user-authorized demo organization was populated and renamed. Existing records were retained. No production records were deleted, pricing or permissions changed, authentication bypassed, database tables edited, or code deployed.

## Environment and execution

The live frontend is `https://sys.hse.techlabeg.com`; its observed API is `https://api.hse.techlabeg.com/`. The local source also names that API, but the localhost runtime and database equivalence were not assumed or used. Chrome DevTools could not attach to its occupied profile, so an isolated Playwright Chrome session performed navigation, DOM inspection, validation, and network inspection. Bulk population used the authenticated organization session and application contracts after UI discovery. Every write was scoped to organization 13, and saved IDs were reconciled against reads.

The public registration form was inspected before the user handed off the approved account. It exposes company and administrator contact fields, employee count, industry and optional address; no visible package selector was found. Registration and approval are therefore recorded as an approved-account handoff, not newly executed submissions.

Email integration was disabled/unconfigured and notification plans were empty when checked. No email integration, SMS/WhatsApp action, notification plan, support message, or employee privileged access was enabled. Internal application notifications and socket registration occur automatically. Credentials and session tokens are excluded from this report and the non-secret checkpoint.

## Module Completion Table

“Verified” means saved records read back from the live application/API. A saved inspection task is distinct from a submitted result. Document metadata is distinct from an accessible file.

| Module | Target | Created | Verified | Status |
|---|---:|---:|---:|---|
| Projects | 6 | 6 | 6 | Met |
| Project zones | 15 | 18 | 18 | Met |
| Locations | 25 | 30 | 30 | Met |
| Employees | 40 | 40 | 40 | Met: 40 fictional staff plus existing master account |
| Teams | 8 | 8 | 8 | Met |
| Contractors | 8 | 8 | 8 | Met |
| Equipment types | 12 | 15 | 15 | Met |
| Equipment | 35 | 35 | 35 | Met |
| Equipment inspection tasks | 45 | 45 | 45 | Met: 45 tasks, 35 saved results, 10 pending |
| Observations | 40 | 40 | 40 | Met |
| Incidents | 12 | 12 | 12 | Met |
| Investigations | 10 | 11 | 11 | Met: 10 incident investigations and 1 observation investigation |
| CAPA source plans | 30 | 33 | 33 | Met |
| HSE objectives | 12 | 12 | 12 | Met |
| Objective progress | 35 | 36 | 36 | Met |
| Emergency drills | 10 | 10 | 10 | Met |
| Employee training completions | 20 | 60 | 60 | Met |
| Maintenance records | 20 | 0 | 0 | Unavailable: no dedicated maintenance CRUD discovered |
| Warehouses | 5 | 5 | 5 | Met |
| Documents | 15 | 15 | 15 | Partial: 15 metadata records; 0 downloadable PDF files verified |

CAPA also includes **31 individual investigation action tasks**, **13 completion records**, **7 task-level effectiveness verifications**, and **2 audit NCR plans**. The CAPA register contains 35 source plans including those NCRs; the 33 observation/incident plans were individually verified. Action states include not started, in progress, on hold, and completed. Six incident investigations are closed and four remain in progress; the additional observation investigation is closed. Auto-generated pending investigation records are retained.

Five of the 35 inspection results contain failed findings. Five historical pending inspections and five future planned tasks remain. Template auto-observation flags did not produce additional saved observations during this execution, so an automatic inspection-to-CAPA chain is not claimed. Equipment service restrictions appear in scenario narratives only; no supported service-status control was available.

### Additional discovered functionality

| Module | Created | Verified | Status |
|---|---:|---:|---|
| Departments | 6 | 6 | Verified |
| Job positions | 20 | 20 | Verified |
| Contractor service scopes | 8 | 8 | Verified |
| Warehouse types | 3 | 3 | Verified |
| Training topics | 15 | 15 | Verified |
| Internal training courses | 15 | 15 | Verified |
| Observation categories | 4 | 4 | Verified |
| Incident categories | 9 | 9 | Verified |
| Hazard classifications | 10 | 10 | Verified |
| Root cause catalogue | 10 | 10 | Verified |
| Investigation factors | 3 | 3 | Verified |
| Factor items | 3 | 3 | Verified |
| Drill types | 10 | 10 | Verified |
| Document categories | 3 | 3 | Verified |
| Inspection templates | 10 | 10 | Verified |
| Inspection results | 35 | 35 | Verified |
| Drill planning entries | 20 | 20 | Verified |
| Drill timeline actions | 20 | 20 | Verified |
| Shifts | 4 | 4 | Verified |
| Permit types | 6 | 6 | Verified |
| Permits to work | 6 | 6 | Verified |
| Inductions | 12 | 12 | Verified |
| Toolbox talks | 12 | 12 | Verified |
| Risk assessment records | 6 | 6 | Verified |
| Management of change | 4 | 4 | Verified |
| Audit standards | 2 | 2 | Verified |
| Audit activities | 3 | 3 | Verified |
| Internal audits | 2 | 2 | Verified |
| Audit NCRs | 2 | 2 | Verified |
| Issued fictional audit report | 1 | 1 | Verified |
| PPE tools | 8 | 8 | Verified |
| PPE items | 8 | 8 | Verified |
| PPE activities | 3 | 3 | Verified |
| PPE employee delivery records | 18 | 18 | 18 employee deliveries from 6 project batches |
| Leadership activities | 3 | 3 | Verified |
| Leadership themes | 2 | 2 | Verified |
| Leadership categories | 2 | 2 | Verified |
| Leadership visits | 6 | 6 | Verified |
| Leadership reports | 3 | 3 | Verified |
| Meeting types | 1 | 1 | Verified |
| Project meetings | 6 | 6 | Verified |
| Document references | 3 | 3 | Verified |
| Policy attachment matrix | 1 | 1 | Three explicit mock images saved; each download HTTP 200 |
| Organization certificates | 0 | 0 | Blocked: normal form contract rejected with HTTP 422; no false certification created |
| PPE activity/tool requirements | 14 | 14 | Three activities contain 5, 5 and 4 linked tools |
| Risk assessment methodology | 1 | 1 | 5×5 task HAZID methodology linked to projects |
| Hazard subtypes | 10 | 10 | Required child classifications used by observations/incidents |
| Position/course requirements | 40 | Not fully reconciled | Submitted; employee completion records verified separately |
| Inspection questions | 63 | 30 usable | 30 grouped questions; 33 ungrouped retained, including 3 retry duplicates |

Role administration and existing master permissions were left unchanged. Notification plans, support tickets and external messaging were intentionally not created. Coding defaults and system branding were inspected and retained. Reports and analytics derive from operational data; they are not independently fabricated records. No separate standalone maintenance scheduler, employee reporting-line editor, certification accreditation service, or separate critical-risk level was discovered. Near misses are represented through supported incident categories.

## Project relationships

| Project / ID | Locations | Zones | Employees | Project teams | Equipment | Permits | Meetings |
|---|---:|---:|---:|---:|---:|---:|---:|
| Rumaila Oil Field HSE Operations / 16 | 5 | 3 | 7 | 2 | 6 | 1 | 1 |
| West Qurna Pipeline Maintenance Project / 17 | 5 | 3 | 7 | 2 | 6 | 1 | 1 |
| Zubair Oil Field Expansion / 18 | 5 | 3 | 7 | 1 | 6 | 1 | 1 |
| Basra Petroleum Storage & Logistics / 19 | 5 | 3 | 7 | 1 | 6 | 1 | 1 |
| Southern Iraq Gas Processing Facility / 20 | 5 | 3 | 6 | 1 | 6 | 1 | 1 |
| Baghdad Petroleum Operations Support / 21 | 5 | 3 | 6 | 1 | 5 | 1 | 1 |

Project employees, team leaders and members, zone equipment, contractor scopes and work locations were assigned through supported relationship endpoints. All 45 inspection details returned the expected asset reference. Departments and positions form the supported organizational hierarchy. Employee-to-employee manager relationships were not invented. Fictional asset serials, identities and internal documents are marked DEMO. English and Arabic translations were supplied where supported.

## Workflow Verification

| Scenario | Result | Evidence and limits |
|---|---|---|
| A: Observation → corrective completion → verification | Passed | Observation 46 → investigation 40 → CAPA 59 → task 96; task completed (5), observation closed (2), effective verification read back (1). |
| B: Incident → investigation → root cause → CAPA | Passed | Incident 87 → investigation 62 → CAPA 81; three team members, five Whys, meaningful findings and three actions. Task 66 completed and effectiveness verification saved. |
| C: Equipment → project → inspection finding | Passed with limitation | Equipment 107 → project 16 → inspection 25 → saved result with failed finding. All 45 asset links match. Automatic observation creation and structured restriction/return-to-service are not verified. |
| D: Objective → historical progress | Passed with KPI defect | Objective 28 has three monthly history records. Latest 82 against 95 means 86.32%; header incorrectly reports 232.63%. |
| E: Project → staff → team → operational records | Passed | Project 16 has 7 staff, 2 teams, 6 assets, 5 locations, 3 zones, a permit, drills and a meeting. All six projects reconciled. |
| F: Maintenance issue → equipment status | Partial / unsupported | Maintenance-related observations, corrective work and follow-up inspection narratives exist. Dedicated maintenance records and operational status transitions are not exposed. |

Representative project summary, CAPA, investigation, objective detail and meeting pages were opened after population. Browser inspection also covered 67 sidebar routes. The organization was reauthenticated normally in a fresh browser context; its refreshed name and organization ID were verified.

## Dashboard Verification

| Component | Live value | Verification |
|---|---:|---|
| Organization projects | 6 | List and portfolio pagination agree |
| Fictional employees | 40 | Employee register contains 41 including existing master; dashboard has no matching staff-total card |
| Equipment ownership | 35 | 27 owned + 8 rented; asset register agrees |
| Incidents | 12 | Incident register agrees |
| Inspection tasks | 45 | Task register agrees |
| Saved inspection results | 35 | Individual task details agree |
| High-risk observations | 3 | Returned by dashboard snapshot; supported risk scale is low/medium/high |
| Open corrective actions | 16 | Backend snapshot value; requires a documented aggregation definition to reconcile against task states and source-plan counts |
| Delayed inspections | 40 | Includes recurring historical tasks; differs from 5 pending tasks scheduled in the past |
| Completed inspection status | 0 | 35 tasks have results but remain in-progress status; not equivalent to result submission |
| Scheduled inspections this month | 1,260 | Backend recurring schedule calculation; not the number of created task records |
| Employee certificate records | 6 active | Does not reconcile directly with 60 saved employee training completions; definition/filter needs correction or clear labeling |
| Project inspections in portfolio | 0 per project | Contradicts linked task details; backend field/mapping contract needs reconciliation |
| Project setup progress | 0% | Legacy creation does not advance wizard progress despite populated relationships |

The dashboard now renders populated equipment, safety, root-cause and location charts. Values were not fabricated or patched. The all-project view was verified after a fresh login with no selected project. Dashboard screenshot: `.hse-demo-runtime/dashboard-final.png`.

## Issues Found

URLs below are relative to `https://sys.hse.techlabeg.com`. HTTP status refers to the observed API response.

| Module / URL | Expected → Actual | HTTP | Likely cause and recommended fix |
|---|---|---|
| Documents `/organization/organization-documents` | PDF saved and downloadable → 15 metadata records persist, but details omit `document_file` and return empty `media` | 200 | Live backend does not persist/return the submitted file contract. Align file storage and response serialization with the form; verify create, update and authenticated download. Generated PDFs remain locally available. |
| Organization certificates `/organization/organization-certificate` | Normal certificate form accepted → requires `data` when `translations` absent | 422 | New flat form and legacy backend contract differ. Align versioned schema and bilingual details before enabling this workflow. No externally accredited certificates were claimed. |
| Objectives `/organization/objectives/28/details` | Latest monthly progress 86.32% → header 232.63% | 200 | Backend cumulatively sums period percentages. Define latest/period aggregation by objective frequency and direction. Preserve correct history values. |
| Project creation `/organization/project/add` | All required fields visible → API requires method IDs without a corresponding selector in the legacy form | 422 initially | Add the required methodology selector and align wizard/legacy schemas. Valid project creation used the existing method contract. |
| Project setup `/organization/project-summary/16` | Saved relationships advance setup → progress remains 0%; wizard blocks later steps | 200 | Legacy create and new wizard progress disagree. Reconcile backend progress transitions; do not manually forge progress. |
| Templates `/organization/template` | Questions visible after creation → ungrouped questions absent from template detail | 200 | Detail serialization only exposes grouped questions. Thirty usable grouped questions were added. A local default-group fix is prepared and tested, not deployed. Thirty-three ungrouped questions were retained, including three retry duplicates; none deleted. |
| Template editing `/organization/template` | UI edit action accepted → action value 3 rejected | 422 | Frontend/backend action enum mismatch. Publish a shared edit contract and verify round trips. |
| Inspection dashboard `/organization` | Result and completion definitions explicit → 35 result-bearing tasks in progress, 0 completed, 40 delayed, 1,260 monthly occurrences | 200 | Recurrence and task-state aggregation need definition and review. Distinguish tasks, occurrences, submitted results, overdue occurrences and closed tasks. |
| Project portfolio `/organization` | Project inspection counts reflect project tasks → shows 0 despite saved project-linked tasks | 200 | Inspect backend aggregate field and frontend mapping against actual task association. |
| Training dashboard `/organization` | Clear training/certificate scope → 6 reported certificates versus 60 employee completions | 200 | Aggregation/filter/category meaning differs. Separate course completion, required competency and certificate expiry metrics. |
| CAPA `/organization/capa/59` | Top-level verification update reflected in details → `update_capa` succeeds but top-level verification fields are absent and `is_verification` remained false | 200 | Legacy top-level verification differs from current task-level workflow. Use and return task-level verification consistently; seven such records were saved and verified. |
| Investigation category `/organization/Investigating` | High category offered → value 3 rejected | 422 | Enum mismatch. Only supported values 1 and 2 used. |
| MOC `/organization/project-details/16/management-of-change` | Advertised PDF/office attachment accepted → risk file must be base64 image | 422 initially | File-picker/backend MIME mismatch. Explicit fictional PNG review sheets were accepted. Align supported MIME types. |
| Attachment matrix `/organization/attachment-matrix` | Policy PDF accepted → image-only validation | 422 initially, then 200 | Real mock PNG policy sheets saved and all three download with HTTP 200. Align file picker/validation if PDFs are intended. |
| Equipment `/organization/equipments` | Description retained and operational status editable → description omitted/null; no supported status control found | 200 | Form/storage mismatch and missing lifecycle workflow. Manufacturers and maintenance states cannot be claimed as persisted where dropped. |
| Shifts `/organization/shifts` | 18:00–06:00 night shift supported → end time before start rejected | 422 initially | Missing overnight-shift semantics. Two valid night segments were created instead. |
| Meetings `/organization/project-meetings/16` | Repeated scheduling allowed at documented pace → one creation per minute | 429 initially | Rate limit respected; six project meetings eventually saved without bypass. Document retry-after behavior. |
| Historical action scheduling `/organization/Investigating` | Historical demo meetings/overdue new actions → past dates rejected | 422 initially | Business validation prevents genuine newly seeded overdue CAPA. Today’s reviews and future deadlines used; audit history was not rewritten. |
| Organization profile `/admin/organization` | Iraq selection persists → target organization details return empty locations | 200 | Verify admin location serialization and organization association. Operational Iraqi location hierarchy is saved. |
| Support `/organization/ticket` | Read-only ticket overview loads cleanly → generic “Unable to complete the operation.” page error | No associated HTTP failure captured | Inspect runtime error with stack and support permission/loading flow. No ticket was submitted or message sent. |

Transient network failures were checked against saved IDs before retry. Meeting group IDs and actual meeting IDs were reconciled. Permit reads were corrected to the appropriate “my permits” view; the assigned-permit view legitimately filters differently. Validation failures and safe recovery steps are retained in the private checkpoint. No blind duplicate bulk retries were used.

## Local Fix and Validation

One minimal local source change sets an omitted/whitespace inspection-question category to `General` in `src/features/setting/TemplateItem/Core/params/addTemplateItemParams.ts`. It prevents newly submitted questions from falling outside the grouped detail response. This does not migrate existing ungrouped questions or alter the production backend.

- Two focused serializer regression tests passed: default category and Arabic category preservation.
- `npm run build-only` passed. Existing bundle-size warnings remain.
- No production deployment or commit was made. Other pre-existing workspace changes were preserved.

## Improvement Recommendations

**Existing functionality to showcase:** bilingual project hierarchy, staff/team/asset assignments, observation and incident reporting, investigation teams and five Whys, corrective/preventive action tracking, task completion and effectiveness verification, objective history, drills, employee training, PPE, permits, risk assessment records, MOC, audits/NCRs, leadership visits, and reporting.

**Functionality needing improvement:** prioritize document file persistence, certificate-form contracts, objective aggregation, project progress compatibility, inspection recurrence/status definitions, portfolio inspection totals, training metric definitions, equipment description persistence, template grouping/edit semantics, and consistent file validation. Distinguish planned, submitted, completed, verified and overdue states explicitly. Publish consistent IDs and pagination/rate-limit contracts.

**New recommended features:** maintenance work orders with asset isolation/return-to-service approvals; a structured inspection-finding-to-observation/CAPA link; competency/expiry matrices with clear internal/external certificate classification; employee reporting lines; auditable permit/isolation handovers; contractor competency and assurance tracking; H2S, lifting, confined-space and process-safety critical-control verification; environmental sampling/waste manifests; and a demo-tenant notification sandbox. These are recommendations, not claims of existing support or regulatory compliance.

## Final Readiness Assessment

**Substantial live demonstration dataset is available; the system is not yet unconditionally ready for a polished client presentation.** Eighteen of the twenty requested target categories are fully met (90% category coverage). Documents are partial: all 15 metadata records are verified, but none of their PDFs is downloadable from the saved record. Maintenance is unavailable. All other supported minimum record targets are met or exceeded. This percentage measures target-category completion, not software correctness or real-world HSE performance.

A guided operational demonstration can show six connected petroleum projects, forty staff, thirty-five assets, forty observations, twelve incidents, detailed investigations, CAPA at multiple stages, thirty-five inspection results, historical objectives, training, drills and additional assurance workflows. Avoid presenting the disputed KPI percentages, setup progress, missing document files, certificate registration, or maintenance lifecycle as working features. Resolve the high-priority contract/aggregation issues before an unqualified sales demonstration.

## Resume and artifact references

- Non-secret checkpoint: `.hse-demo-runtime/.hse-demo-progress.json` (ignored by Git).
- Verified totals and relationships: `.hse-demo-runtime/final-verification.json`.
- Browser route results: `.hse-demo-runtime/ui-final.json`.
- Dashboard image: `.hse-demo-runtime/dashboard-final.png`.
- Fifteen generated fictional PDFs: `.hse-demo-runtime/documents/`.
- Focused local tests: `.hse-demo-runtime/template-question-contract.test.cjs`.

Session storage is private runtime state and is not part of the deliverable. Resume by checking saved IDs and outstanding issues; do not register another organization or recreate existing records.

## Discovered Route Inventory

These 67 sidebar routes were navigated in the live organization. Relevant create forms and contracts were inspected during staged discovery. This inventory includes read-only views and settings; it does not imply that every route has independent CRUD or that every possible transition was exhaustively tested. Project-specific drill, permit, leadership, meeting, risk and MOC views were additionally inspected.

| Route | Purpose / completion |
|---|---|
| `/organization` | Populated dashboard and charts |
| `/organization/project-progress` | Read-only overview; project setup progress defect recorded |
| `/organization/projects` | Six projects verified |
| `/organization/equipments` | 35 assets verified; category views populated |
| `/organization/equipments?equipment_type=3` | 35 assets verified; category views populated |
| `/organization/equipments?equipment_type=2` | 35 assets verified; category views populated |
| `/organization/equipments?equipment_type=1` | 35 assets verified; category views populated |
| `/organization/equipment-mangement/incedant?isAll=1` | 12 incidents verified |
| `/organization/equipment-mangement/observation?isAll=1&type=2` | 40 observations verified across supported categories |
| `/organization/equipment-mangement/inspection?inspectionType=1` | 45 tasks / 35 results verified |
| `/organization/Investigating` | 11 configured investigations; pending autogenerated records retained |
| `/organization/capa` | 35 source plans including 2 NCRs; task states and verification demonstrated |
| `/organization/inductions` | 12 saved inductions |
| `/organization/ppe-matrix` | PPE activity matrix and employee deliveries populated |
| `/organization/objectives` | 12 objectives / 36 histories; header aggregation defect |
| `/organization/internal-audit/register` | 2 audits, 2 NCRs, 1 report |
| `/organization/my-internal-audit` | Assignment-dependent audit view; no unrelated assignments modified |
| `/organization/system-identity` | Branding settings inspected; retained |
| `/organization/certificate` | 15 internal training courses |
| `/organization/organization-certificate` | Blocked flat-form/backend contract |
| `/organization/organization-documents` | 15 metadata records; file persistence blocked |
| `/organization/template` | 10 templates / 30 grouped questions |
| `/organization/herikaly` | 6 departments / 20 positions |
| `/organization/organization-employee` | 40 fictional employees; existing master retained |
| `/organization/contractor` | 8 fictional contractors |
| `/organization/role` | Read-only inspection; no privileged roles created |
| `/organization/notification-plan` | Empty; intentionally not enabled |
| `/organization/attachment-matrix` | 3 mock image attachments, all downloads HTTP 200 |
| `/organization/scope` | 8 contractor scopes |
| `/organization/where-house` | 5 warehouses |
| `/organization/employee-certificate` | 60 completions; matrix inspected |
| `/organization/serial-number` | Defaults inspected; retained |
| `/organization/factory` | 3 factors |
| `/organization/factories-items` | 3 factor items |
| `/organization/document-refrence` | 3 mock internal references |
| `/organization/shifts` | 4 valid shift segments |
| `/organization/ticket` | Read-only; generic page error; no outbound ticket |
| `/organization/areas` | 30 Iraqi work locations |
| `/organization/project-zone` | 18 zones |
| `/organization/ppe-matrix-settings` | 3 activities / 8 tools / 14 requirements |
| `/organization/document-categories` | 3 categories |
| `/organization/audit-standards` | 2 fictional internal standards |
| `/organization/audit-activities` | 3 activities |
| `/organization/ppe-items` | 8 PPE items |
| `/organization/visit-activities` | 3 leadership activities |
| `/organization/visit-themes` | 2 themes |
| `/organization/visit-categories` | 2 categories |
| `/organization/team` | 8 teams with memberships/leaders |
| `/organization/drill-types` | 10 types |
| `/organization/where-house-type` | 3 types |
| `/organization/hazard-type` | 10 hazard classifications |
| `/organization/accidents-type` | 9 incident categories |
| `/organization/observation-type` | 4 observation categories |
| `/organization/equipment-types` | 15 types including machines/devices/tools |
| `/organization/hazard` | 10 child hazard classifications |
| `/organization/root-causes` | 10 root causes |
| `/organization/injury` | 1 fictional injury classification |
| `/organization/meeting-types` | 1 selected-date type |
| `/organization/ptw-types` | 6 permit types |
| `/organization/management-change-topic-type` | 1 change topic |
| `/organization/traning-topics` | 15 training topics |
| `/organization/Investigating?isAll=1` | 11 configured investigations; pending autogenerated records retained |
| `/organization/equipment-mangement/incident-report` | Read-only report using incident data |
| `/organization/equipment-mangement/observation-report` | Read-only report using observation data |
| `/organization/corrective-report` | Read-only corrective report |
| `/organization/preventive-report` | Read-only preventive report |
| `/organization/lessons-learnt-report` | Read-only lessons report |
