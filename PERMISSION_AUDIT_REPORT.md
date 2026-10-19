# Organization permission audit

Status: **checkpoint finalized at the user's request; frontend hardening implemented in stages; the requested complete security audit is not complete. Do not treat this report as production authorization sign-off.**

## Starting state and scope

Work started on branch `permissions` with a clean working tree. Existing committed work was preserved. No commits, pushes, merges, resets, cleans, or stashes were performed. No repository `AGENTS.md` was found. The workspace contains the frontend only; the user confirmed that neither backend source nor a scoped permission-assignment API contract is available.

Recursive inventory covers **2,645 files, 45 feature directories (including empty `Operations`), 566 Vue components, and 1,874 template event bindings** under `src/features/Organization/`. One root translation file is inventoried separately. Event counts include ordinary input events; they are candidates for review, not 1,874 independently verified business operations.

The router inventory includes 331 static route definitions across all route sources. A browser-loaded router exposes **298 Organization routes**, all of which now resolve to an explicit authorization policy. An explicit unsupported policy denies ordinary users; it is not evidence of completed feature support.

Machine-readable evidence:

- [Recursive feature, file, action, navigation, and API inventory](docs/permission-audit/inventory.json)
- [Route and API policy matrix](docs/permission-audit/policy-matrix.json)
- [Actual runtime Organization routes](docs/permission-audit/runtime-routes.json)
- [Per-component boundary and pending-review ledger](docs/permission-audit/component-boundaries.json)
- [Manually reviewed action checkpoints](docs/permission-audit/manual-action-review.json)
- [Local export/print boundaries](docs/permission-audit/local-file-boundaries.json)
- [Backend-observed permission codes](docs/permission-audit/backend-permission-codes.json)
- [Live organization-user verification](docs/permission-audit/live-user-verification.json)
- [Test results](docs/permission-audit/test-results.json)
- [Files changed during this audit](docs/permission-audit/changed-files.json)

The inventory reads every source file. Automated inventory and policy generation **do not replace individual semantic review**. Direct-network regex matches are candidates and can include similarly named application methods.

## A–B. Organization feature inventory and permission matrix

The following are existing enum families used for initial policy mappings. `Unconfirmed` means no independently confirmed permission mapping, not permission to perform the operation. Existing explicit feature `ALL` grants are included alongside operation grants in policy tables; `can()` itself never synthesizes `ALL`. Backend enforcement and account-level availability remain unverified except for the read-only findings below.

Every feature in this table is inventoried. Individual nested action review remains pending unless its exact boundary is recorded in the component ledger.

| Feature | Files / Vue | INDEX | SHOW | CREATE | EDIT | DELETE |
| --- | --- | --- | --- | --- | --- | --- |
| AttachmentMatrix | 14 / 1 | `ATTACHMENT_MATRIX_FETCH` | Unconfirmed | `ATTACHMENT_MATRIX_CREATE` | Unconfirmed | Unconfirmed |
| AuditActivity | 41 / 7 | `ORG_AUDIT_ACTIVITIES_FETCH` | `ORG_AUDIT_ACTIVITIES_DETAILS` | `ORG_AUDIT_ACTIVITIES_CREATE` | `ORG_AUDIT_ACTIVITIES_UPDATE` | `ORG_AUDIT_ACTIVITIES_DELETE` |
| AuditStandard | 41 / 7 | `ORG_AUDIT_STANDARDS_FETCH` | `ORG_AUDIT_STANDARDS_DETAILS` | `ORG_AUDIT_STANDARDS_CREATE` | `ORG_AUDIT_STANDARDS_UPDATE` | `ORG_AUDIT_STANDARDS_DELETE` |
| Capa | 47 / 6 | `CAPA_FETCH` | `CAPA_DETAILS` | `CAPA_CAREATE` | `CAPA_UPDATE` | `CAPA_DELETE` |
| CheckList | 32 / 6 | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| DocumentCategory | 41 / 7 | `ORG_DOCUMENT_CATEGORY_FETCH` | `ORG_DOCUMENT_CATEGORY_DETAILS` | `ORG_DOCUMENT_CATEGORY_CREATE` | `ORG_DOCUMENT_CATEGORY_UPDATE` | `ORG_DOCUMENT_CATEGORY_DELETE` |
| DocumentRefrence | 32 / 5 | `ORG_DOCUMENTATION_REFERENCE_FETCH` | `ORG_DOCUMENTATION_REFERENCE_DETAILS` | `ORG_DOCUMENTATION_REFERENCE_CREATE` | `ORG_DOCUMENTATION_REFERENCE_UPDATE` | `ORG_DOCUMENTATION_REFERENCE_DELETE` |
| DrillType | 42 / 8 | `ORG_DRILL_TYPE_FETCH` | `ORG_DRILL_TYPE_DETAILS` | `ORG_DRILL_TYPE_CREATE` | `ORG_DRILL_TYPE_UPDATE` | `ORG_DRILL_TYPE_DELETE` |
| EmployeesCertificates | 40 / 11 | `EMPLOYEE_CERTIFICATE_FETCH` | `EMPLOYEE_CERTIFICATE_DETAILS` | `EMPLOYEE_CERTIFICATE_CREATE` | `EMPLOYEE_CERTIFICATE_UPDATE` | `EMPLOYEE_CERTIFICATE_DELETE` |
| ForgetPassword | 4 / 4 | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Herikaly | 59 / 10 | `HERIKALY_FETCH` | `HERIKALY_DETAILS` | `HERIKALY_CREATE` | `HERIKALY_UPDATE` | `HERIKALY_DELETE` |
| Injury | 40 / 6 | `INJURY_FETCH` | `INJURY_DETAILS` | `INJURY_CREATE` | `INJURY_UPDATE` | `INJURY_DELETE` |
| Inspection | 134 / 46 | `ORG_INSPECTION_FETCH` | `ORG_INSPECTION_DETAILS` | `ORG_INSPECTION_CREATE` | `ORG_INSPECTION_UPDATE` | `ORG_INSPECTION_DELETE` |
| InternalAudit | 123 / 12 | `INTERNAL_AUDIT_FETCH` | `INTERNAL_AUDIT_DETAILS` | `INTERNAL_AUDIT_CREATE` | `INTERNAL_AUDIT_UPDATE` | `INTERNAL_AUDIT_DELETE` |
| Investigating | 179 / 58 | `INVESTIGATION_FETCH` | `INVESTIGATION_DETAILS` | `INVESTIGATION_CREATE` | `INVESTIGATION_UPDATE` | `INVESTIGATION_DELETE` |
| MangementChangeTopicType | 44 / 7 | `ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_FETCH` | `ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_DETAILS` | `ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_CREATE` | `ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_UPDATE` | `ORG_MANAGEMENT_CHANGE_TOPIC_TYPE_DELETE` |
| MangementOfChange | 32 / 4 | `MOC_FETCH` | `MOC_DETAILS` | `MOC_CRAETE` | `MOC_UPDATE` | `MOC_DELETE` |
| MeetingType | 45 / 8 | `ORG_MEETING_TYPE_FETCH` | `ORG_MEETING_TYPE_DETAILS` | `ORG_MEETING_TYPE_CREATE` | `ORG_MEETING_TYPE_UPDATE` | `ORG_MEETING_TYPE_DELETE` |
| ObservationFactory | 127 / 49 | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Operations | 0 / 0 | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| OrganizationEmployee | 90 / 24 | `ORG_EMPLOYEE_FETCH` | `ORG_EMPLOYEE_DETAILS` | `ORG_EMPLOYEE_CREATE` | `ORG_EMPLOYEE_UPDATE` | `ORG_EMPLOYEE_DELETE` |
| OrganizationLocation | 34 / 7 | `ORG_LOCATION_FETCH` | `ORG_LOCATION_DETAILS` | `ORG_LOCATION_CREATE` | `ORG_LOCATION_UPDATE` | `ORG_LOCATION_DELETE` |
| PPEActivity | 41 / 7 | `ORG_PPE_ACTIVITY_FETCH` | `ORG_PPE_ACTIVITY_DETAILS` | `ORG_PPE_ACTIVITY_CREATE` | `ORG_PPE_ACTIVITY_UPDATE` | `ORG_PPE_ACTIVITY_DELETE` |
| PPETool | 41 / 7 | `ORG_PPE_TOOLS_FETCH` | `ORG_PPE_TOOLS_DETAILS` | `ORG_PPE_TOOLS_CREATE` | `ORG_PPE_TOOLS_UPDATE` | `ORG_PPE_TOOLS_DELETE` |
| PTWType | 41 / 7 | `ORG_PTW_TYPE_FETCH` | Unconfirmed | `ORG_PTW_TYPE_CREATE` | `ORG_PTW_TYPE_UPDATE` | `ORG_PTW_TYPE_DELETE` |
| Partner | 34 / 7 | `PARTNER_FETCH` | `PARTNER_DETAILS` | `PARTNER_CREATE` | `PARTNER_UPDATE` | `PARTNER_DELETE` |
| Project | 574 / 130 | `PROJECT_FETCH` | `PROJECT_DETAILS` | `PROJECT_CREATE` | `PROJECT_UPDATE` | `PROJECT_DELETE` |
| ProjectPrgoress | 44 / 9 | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| ProjectZone | 39 / 7 | `PROJECT_ZONE_FETCH` | `PROJECT_ZONE_DETAILS` | `PROJECT_ZONE_CREATE` | `PROJECT_ZONE_UPDATE` | `PROJECT_ZONE_DELETE` |
| Role | 37 / 7 | `ORG_ROLE_FETCH` | `ORG_ROLE_DETAILS` | `ORG_ROLE_CREATE` | `ORG_ROLE_UPDATE` | `ORG_ROLE_DELETE` |
| Scope | 34 / 7 | `SCOPE_FETCH` | `SCOPE_DETAILS` | `SCOPE_CREATE` | `SCOPE_UPDATE` | `SCOPE_DELETE` |
| SerialNumber | 16 / 2 | `CODING_SYSTEM_FETCH` | `CODING_SYSTEM_DETAILS` | `CODING_SYSTEM_CREATE` | `CODING_SYSTEM_UPDATE` | `CODING_SYSTEM_DELETE` |
| Shifts | 31 / 4 | `ORG_SHIFT_FETCH` | `ORG_SHIFT_DETAILS` | `ORG_SHIFT_CREATE` | `ORG_SHIFT_UPDATE` | `ORG_SHIFT_DELETE` |
| TaskReports | 19 / 4 | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Ticket | 50 / 11 | `TICKET_FETCH` | `TICKET_DETAILS` | `TICKET_CREATE` | `TICKET_UPDATE` | `TICKET_DELETE` |
| TicketType | 31 / 4 | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| TraningTopic | 43 / 9 | `ORG_TRANING_TOPIC_FETCH` | `ORG_TRANING_TOPIC_DETAILS` | `ORG_TRANING_TOPIC_CREATE` | `ORG_TRANING_TOPIC_UPDATE` | `ORG_TRANING_TOPIC_DELETE` |
| VisitActivity | 34 / 5 | `ORG_VISIT_ACTIVITIES_FETCH` | `ORG_VISIT_ACTIVITIES_DETAILS` | `ORG_VISIT_ACTIVITIES_CREATE` | `ORG_VISIT_ACTIVITIES_UPDATE` | `ORG_VISIT_ACTIVITIES_DELETE` |
| VisitCategory | 34 / 5 | `ORG_VISIT_CATEGORY_FETCH` | `ORG_VISIT_CATEGORY_DETAILS` | `ORG_VISIT_CATEGORY_CREATE` | `ORG_VISIT_CATEGORY_UPDATE` | `ORG_VISIT_CATEGORY_DELETE` |
| VisitTheme | 34 / 5 | `ORG_VISIT_THEME_FETCH` | `ORG_VISIT_THEME_DETAILS` | `ORG_VISIT_THEME_CREATE` | `ORG_VISIT_THEME_UPDATE` | `ORG_VISIT_THEME_DELETE` |
| WhereHouse | 35 / 7 | `WHIERE_HOUSE_FETCH` | `WHIERE_HOUSE_DETAILS` | `WHIERE_HOUSE_CREATE` | `WHIERE_HOUSE_UPDATE` | `WHIERE_HOUSE_DELETE` |
| WhereHouseType | 41 / 7 | `WHIERE_HOUSE_TYPE_FETCH` | `WHIERE_HOUSE_TYPE_DETAILS` | `WHIERE_HOUSE_TYPE_CREATE` | `WHIERE_HOUSE_TYPE_UPDATE` | `WHIERE_HOUSE_TYPE_DELETE` |
| notificationPlan | 36 / 2 | `NOTIFICATION_PLAN_FETCH` | `NOTIFICATION_PLAN_DETAILS` | `NOTIFICATION_PLAN_CREATE` | `NOTIFICATION_PLAN_UPDATE` | `NOTIFICATION_PLAN_DELETE` |
| objectives | 72 / 12 | `objectives_FETCH` | `objectives_DETAILS` | `objectives_CREATE` | `objectives_UPDATE` | `objectives_DELETE` |
| ppeItem | 42 / 8 | `ORG_PPE_ITEM_FETCH` | `ORG_PPE_ITEM_DETAILS` | `ORG_PPE_ITEM_CREATE` | `ORG_PPE_ITEM_UPDATE` | `ORG_PPE_ITEM_DELETE` |

`ObservationFactory` is deliberately split by payload discriminator: type 1 uses `ORG_OBSERVATION_*`, type 2 uses `ORG_HAZARD_*`, and type 3 uses `ORG_INCEDANT_*`. Mixed-type list requests require permission for every requested type. Unknown types and unresolved type context deny access. The backend must still verify a record's actual type; client route context cannot establish resource ownership.

Custom operations have explicit overrides in the policy matrix. Examples: CAPA results use existing `CAPA_SET_RESULT`; investigation tasks, meetings, and task results use their respective existing families; full investigation creation/result use their existing specialized identifiers. Objective progress currently uses existing objective UPDATE/DETAILS grants because no independent progress family is registered. Self-service `FetchMyProjects` and `FetchMyZones` retain authenticated access and require backend scoping. These mappings require backend contract review before production sign-off.

## C–D. Missing permissions and enum changes

No permission IDs were invented, renamed, or removed. The exact `//the new permssions` marker was added for future backend-registered identifiers; **zero new enum entries** were introduced. The existing enum has 991 entries and a pre-existing collision: `CREATE_PERMISSION` and `CATEGORY_ALL` both equal `C00`. This cannot safely be resolved without backend confirmation.

The observed `show_permissions` response contains 361 unique code strings, all already present in the enum. These rows are registration evidence only and must not become a user's effective grants.

Unconfirmed operations include checklist/ticket-type families, project drills and meetings, today talks, investigation closing, stop-work/status changes, audit attendance/participants/report submission, identity management, and independent import/export/print/download permissions. Missing identifiers are not borrowed from another feature or generic INDEX permission. The existing `is_master === 1` client rule is preserved; live master-account behavior and its backend semantics could not be verified.

## E. Permission assignment form

- Registry definitions are cloned per editor; checkbox state does not mutate a shared singleton.
- Search, feature grouping, group select/deselect, mixed state, and selected counts are available.
- Granular selection never silently generates an ALL grant.
- Existing unknown or unrepresented assignments are retained.
- Additions are limited to known permissions held by the editor and, when available, exposed by the backend catalogue. Unmanageable original grants cannot be removed accidentally.
- Editing rechecks permission at submit time and validates changes before controller execution.
- A response must identify `type`, `type_id`, and an explicit `permissions` array before it can be used as an assignment snapshot. This is a conservative acceptance condition, **not a claim that the current backend implements such a contract**.
- The live array-only `show_permissions` response is rejected as unscoped. Save remains unavailable rather than replacing assignments with a global collection.
- The existing catalogue endpoint returned 404 in a direct read-only check. A warning is displayed; no new identifiers are inferred.
- The nonexistent `CreatePermission` API getter was replaced with the existing permission-upsert endpoint getter.

## F. Sidebar

OrganizationSidebar resolves destinations through the same route-policy helper as navigation guards. Nested entries are filtered recursively. Parents with no accessible destination or children disappear; a parent that only has an accessible child links to that child. Empty navigation groups are hidden. Permissions are reactive; removing the last accessible route removes the pane without retaining clickable links during its leave animation. Existing layout, route highlighting, query-specific reports, translations, and mobile structure remain.

Every destination in the actual sidebar is evaluated this way, including operations, company, reports, organization settings, locations, lookups, support, and setup overview. The sidebar test verifies a project-list grant, rejects unauthorized destinations, and checks revocation. Full mobile navigation with a live fully privileged account remains untested because admin login is blocked.

## G. Route authorization

`authGuard` authorizes Organization routes after any in-progress permission refresh finishes. Missing policies and unready permission state deny access. A 403 route displays localized denial, refresh, and sign-in actions without a redirect loop. Organization accounts are blocked from `/admin/` child routes. The previous injected-router dependency inside the guard was removed so programmatic navigation is reliable.

Existing shared-route suffixes and generated location names are normalized. Query-sensitive inspection/results routes and own-versus-other employee tasks have explicit checks. Already-open protected routes are reauthorized when grants change and redirect to 403 when access is revoked. The exact 298 runtime names, paths, and policy requirements are in the runtime-route ledger; **there are no unclassified runtime Organization routes**. Unsupported policies still require contract/mapping work.

## H–I. Components, executable boundaries, and issues fixed

- Existing `PermissionHandler` delegates to centralized, type-safe single/ANY/ALL checks. Missing/invalid/loading/invalidated state denies access. Empty ANY/ALL requests also deny.
- Broad role markers such as Organization Employee cannot substitute CREATE, UPDATE, DELETE, or view permissions for Organization accounts. Email is never an override.
- Both PermissionBuilder import locations now share one implementation and react to permission changes.
- Shared dropdowns filter actions and recheck before callbacks. Delete confirmations recheck on confirmation, preventing use of stale menu/dialog state.
- The shared authenticated API service checks the URL and payload before dispatch, covering programmatic controller/repository calls through that service. Unknown operations deny ordinary users. HTTP 403 invalidates cached grants.
- Login parses whether the permission list was actually supplied. Logout/account switches, including token or account-type changes with matching numeric IDs, clear grants and project context; refresh responses cannot transfer grants across account/token changes.
- Refresh rejects the observed unscoped catalogue-shaped response and requires reauthentication or a verified account-scoped response.
- **85 standalone mutation components** now have visibility boundaries derived from their actual imported controller/API dependency. This is separate from the executable API check. The component ledger lists each changed component and endpoint.
- Six additional components have partial manual action reviews: attachment matrix, inspection index, investigation index/table, result submission, and read-only result answers. Submission and viewing route mappings were corrected; inspection results now require the dedicated results grant. Attachment-matrix viewers cannot upload or save. Read-only report labels remain visible when details links are unavailable.
- Shared Excel/PDF export and print execution are protected. The local-file audit additionally guards 35 direct file-generation/print functions across 26 Organization components and adds capability metadata to 39 menu actions; ordinary CRUD grants cannot authorize these operations. In the absence of independent registered capability identifiers, ordinary Organization users cannot execute these shared capabilities. This intentionally restrictive behavior needs a backend-supported policy decision before rollout.
- Commented bearer-token examples were removed from the header utility.

**Coverage limitation:** 481 other Vue components remain listed for individual action review. Some are display-only, some contain multiple operations, and others open nested dialogs or use local browser operations. Their state is not marked complete. Wrapping a mutation component does not prove every nested operation is semantically mapped. Public media URLs, unclassified browser download patterns, per-form lookup dependencies, local actions, and nested cached data still require individual review. The 22 regex direct-network candidates were inspected and are application fetch methods rather than direct axios/fetch calls; this lexical check does not prove the absence of all alternative network transports.

## J. Validation performed

| Check | Actual result |
| --- | --- |
| Baseline production build | Passed, 29.48 s |
| Latest production build | Passed, 35.01 s; existing large-chunk warnings |
| Permission browser/component/policy tests | 22 passed |
| Existing objective-progress tests | 14 passed |
| Combined Playwright run | 36 passed, 0 failed, 1.8m |
| Focused ESLint on 16 permission/core files | 0 errors, 0 warnings |
| ESLint on 148 changed source files | 117 errors, 49 warnings, all matching pre-existing diagnostics |
| Baseline TypeScript | Failed: 3,646 existing diagnostics |
| Current TypeScript | Failed: 3,631 diagnostics; no introduced diagnostics in changed files |
| Diff whitespace check | Passed |
| Live test-user protected URLs | Project index/create and permission editor denied; zero mutation requests and zero page errors |
| Mobile denial page, 390 px | Screenshot inspected; no horizontal overflow |
| Admin permission assignment scenarios A–G | Blocked; not executed |
| Permission save/persistence/restoration | Not executed; no live assignments changed |

The unchanged ProjectSummary TypeScript diagnostic has a different ordering of union members in its message; its source location and error existed at baseline. Global typecheck and lint are **not passing** and are not described as passing.

Run tests against the already-running local Vite app:

```sh
TMPDIR=/dev/shm npx playwright test scripts/organization-permissions.spec.ts scripts/objective-progress.spec.ts --output=/dev/shm/hse-permission-test-artifacts --reporter=line
```

The new tests cover fail-closed inputs, independent CRUD, every registered static policy, runtime route classification, mixed observation types, direct unauthorized navigation, zero-request mutation denial, assignment scope, preserving unknown grants, no synthesized ALL, reactive wrapper/sidebar visibility, action revocation, HTTP-403 invalidation, scoped refresh, and cross-session response races. Browser fixture requests to the backend domain are intercepted; fixtures do not alter real accounts.

Live organization-user verification used the supplied successful login/session in an isolated browser context. Admin and user login diagnostics used separate contexts. Admin Organization login returned 422 (credentials rejected); the platform-admin login returned 500. These are failures, not successful admin verification.

Screenshots are temporary local artifacts, not committed account data:

- `/dev/shm/hse-permission-audit/user-denied-desktop.png`
- `/dev/shm/hse-permission-audit/user-denied-mobile.png`

No credentials, bearer tokens, or complete account response bodies are included in repository evidence.

## K. Backend dependencies and release blockers

Read-only calls with the organization test user's valid token and **zero login permissions** returned successful, nonempty responses from `fetch_projects`, `fetch_organization_employees`, and `fetch_observations`. This demonstrates that frontend permission denial alone cannot protect those APIs. It does not prove every backend operation lacks authorization; no destructive or mutation authorization probe was performed.

`show_permissions` returned 14,386 rows with repeated codes and no verified target-account scope, both for JSON and multipart requests. The frontend must not apply these as user 1074's assignments. `fetch_permissions` returned 404. The original grants cannot safely be established from that response, so assignment scenarios were not attempted. Nothing needs restoring because no assignments or records were changed.

Required backend work:

1. Enforce feature/action authorization and organization/resource scoping on every protected endpoint, including reads.
2. Provide and document an authenticated, account-scoped assigned-permissions response and a valid assignable-permission catalogue.
3. Verify permission updates cannot delegate grants the acting user does not control; preserve unrelated assignments.
4. Register missing custom-operation identifiers and resolve the existing `C00` collision without inventing frontend values.
5. Restore a working admin test login and verify the master rule with the backend.
6. Independently protect downloadable/private media and scoped self-service project/zone lookups.

The backend is absent and the user confirmed no contract is available. These changes cannot be implemented or verified from this workspace.

## L. Remaining work and exact continuation point

1. Start with pending entries in `docs/permission-audit/component-boundaries.json`, beginning with AttachmentMatrixForm and multi-operation Project/Inspection/Investigating components. Trace every handler through controller/use-case/repository/API, identify local-only operations, and record the semantic decision per action in the recursive inventory. Do not mark the 481 remaining components complete merely because the shared API boundary exists.
2. Review every initial generated mapping against actual backend semantics, especially edit-page detail/lookups, scope-specific project resource calls, inspection results, and all unsupported routes/endpoints listed below.
3. Replace role-only feature wrappers and wrongly mapped actions as they are individually reviewed; preserve independent view/create/edit/delete behavior.
4. Complete native download/print/export/import and direct-network execution review, plus stale rendered-data behavior when permissions change while a page remains mounted.
5. When a scoped backend contract and working admin account exist, record a verified original assignment snapshot, run reversible A–G account scenarios, verify persistence and refresh, and restore that exact snapshot. Never use the unscoped 14,386-row response as the baseline.
6. Run the expanded suite, all authorized real feature routes on desktop/mobile/RTL, and final build/typecheck/lint. Separate existing global failures from introduced ones.

Checklist:

- [x] Entire Organization source tree inventoried.
- [x] Existing enum, shared permission architecture, router, sidebar, and assignment form inspected.
- [x] Central fail-closed helper and shared request boundary implemented.
- [x] Every runtime Organization route has an explicit policy, including denied unsupported cases.
- [x] Sidebar and shared actions use centralized policies.
- [x] 85 standalone mutation components have added boundaries.
- [x] Focused tests and build executed successfully.
- [x] Live organization-user denial tested without mutations.
- [x] 35 local file/print execution functions and 39 menu actions guarded.
- [x] Already-open route revocation and cross-session project context covered by regression tests.
- [ ] Every individual feature action semantically reviewed and mapped.
- [ ] Every custom operation has a backend-supported identifier.
- [ ] Backend authorization verified/fixed.
- [ ] Admin workflow and live permission-assignment matrix completed.
- [ ] Global TypeScript and ESLint checks pass.
- [ ] Full production-grade permission coverage established.

## Unsupported route ledger

These are explicit denial policies for ordinary users pending verified mappings/registration. The master exception is only the pre-existing server-field rule described above.

| Runtime route | Path | Reason |
| --- | --- | --- |
| `Project Permit Answer` | `/organization/project-permit/project/templates/answer` | Permit answer submission needs its own backend identifier |
| `Project Permit Templates` | `/organization/project-permit/project/templates` | Permit template answer operation needs its own backend identifier |
| `Upload Organization Employee` | `/organization/organization-employee/upload` | No independent import permission for Upload Organization Employee |
| `Upload Hierarchy Excel` | `/organization/herikaly/upload-excel` | No independent import permission for Upload Hierarchy Excel |
| `Upload Injury Excel` | `/organization/injury/upload-excel` | No independent import permission for Upload Injury Excel |
| `Upload WarehouseType` | `/organization/where-house-type/upload` | No independent import permission for Upload WarehouseType |
| `Import OrganizationCertificate` | `/organization/organization-certificate/import-excel` | No independent import permission for Import OrganizationCertificate |
| `Import OrganizationDocuments` | `/organization/organization-documents/import-excel` | No independent import permission for Import OrganizationDocuments |
| `Create Ticket Type` | `/organization/ticket-type/add` | No confirmed create permission for this feature |
| `Add CheckList` | `/organization/check-list/add` | No confirmed create permission for this feature |
| `Add Today Talk` | `/organization/today-talks/create` | Today talks need backend permission identifiers |
| `Upload Accidents Type Excel Organization` | `/organization/accidents-type/upload-excel` | No independent import permission for Upload Accidents Type Excel |
| `Add Incident Category Organization` | `/organization/incident-category/add` | No confirmed create permission for this feature |
| `Upload Drill Types Organization` | `/organization/drill-type/upload-excel` | No independent import permission for Upload Drill Types |
| `Upload PPE Items Organization` | `/organization/ppe-item/upload-excel` | No independent import permission for Upload PPE Items |
| `Import Certificate Organization` | `/organization/certificate/import-excel` | No independent import permission for Import Certificate |
| `Upload Equipment Excel Organization` | `/organization/equipment/upload-excel` | No independent import permission for Upload Equipment Excel |
| `Upload Equipment Type Excel Organization` | `/organization/equipment-type/upload-excel` | No independent import permission for Upload Equipment Type Excel |
| `Upload Hazard Classification Organization` | `/organization/hazard-type/upload-excel` | No independent import permission for Upload Hazard Classification |
| `Import Observeration Type Organization` | `/organization/observation-type/upload-excel` | No independent import permission for Import Observeration Type |
| `Upload Root Causes Excel Organization` | `/organization/root-causes/upload-excel` | No independent import permission for Upload Root Causes Excel |
| `Create Ticket Type Organization` | `/organization/ticket-type/add` | No confirmed create permission for this feature |
| `Upload WarehouseType Organization` | `/organization/where-house-type/upload` | No independent import permission for Upload WarehouseType |
| `Upload Injury Excel Organization` | `/organization/injury/upload-excel` | No independent import permission for Upload Injury Excel |
| `Upload Meeting Types Organization` | `/organization/meeting-type/upload-excel` | No independent import permission for Upload Meeting Types |
| `Upload PTW Types Organization` | `/organization/ptw-type/upload-excel` | No independent import permission for Upload PTW Types |
| `Upload PPE Activities Organization` | `/organization/ppe-activity/upload-excel` | No independent import permission for Upload PPE Activities |
| `Upload PPE Tools Organization` | `/organization/ppe-tool/upload-excel` | No independent import permission for Upload PPE Tools |
| `Upload Document Categories Organization` | `/organization/document-category/upload-excel` | No independent import permission for Upload Document Categories |
| `Upload Audit Standards Organization` | `/organization/audit-standard/upload-excel` | No independent import permission for Upload Audit Standards |
| `Upload Audit Activities Organization` | `/organization/audit-activity/upload-excel` | No independent import permission for Upload Audit Activities |
| `Upload Traning Topics Organization` | `/organization/traning-topic/upload-excel` | No independent import permission for Upload Traning Topics |
| `Create Today Talk` | `/organization/project-details/:id/today-talk/create` | Today talks need backend permission identifiers |
| `Edit Ticket Type` | `/organization/ticket-type/:id/edit` | No confirmed update permission for this feature |
| `Edit Ticket Type Organization` | `/organization/ticket-type/:id/edit` | No confirmed update permission for this feature |
| `Project Meetings` | `/organization/project-meetings/:project_id` | Project meetings need backend permission identifiers |
| `Edit CheckList` | `/organization/check-list/:id` | No confirmed update permission for this feature |
| `Edit Incident Category Organization` | `/organization/incident-category/:id` | No confirmed update permission for this feature |
| `Equipment Mangement` | `/organization/equipment-mangement` | No reviewed feature mapping for Equipment Mangement |
| `System Identity` | `/organization/system-identity` | Identity management has no independently confirmed backend permission |
| `Ticket Type` | `/organization/ticket-type` | No confirmed fetch permission for this feature |
| `CheckList` | `/organization/check-list` | No confirmed fetch permission for this feature |
| `Today Talks` | `/organization/today-talks` | Today talks need backend permission identifiers |
| `Incident Categories Organization` | `/organization/incident-category` | No confirmed fetch permission for this feature |
| `Ticket Type Organization` | `/organization/ticket-type` | No confirmed fetch permission for this feature |

## Unsupported API-policy ledger

The five shared observation CRUD endpoints are handled by the discriminator-aware `canOrganizationApi` path before static lookup; their generic entries below are deliberate fallbacks and do not mean the specialized checks are absent. Other entries require individual backend/mapping review. Unknown endpoints also deny even if not listed.

| Endpoint | Unconfirmed requirement |
| --- | --- |
| `fetch_task_details` | Conflicting policies for endpoint fetch_task_details |
| `change_objectives_active_status` | No independently confirmed backend permission for DisObjectives |
| `clone_teams` | No independently confirmed backend permission for CloneTeam |
| `create_project_holidays` | No independently confirmed backend permission for CreateProjectHolidays |
| `update_project_holidays` | No independently confirmed backend permission for UpdateProjectHolidays |
| `fetch_today_talks` | Today talk permission family is absent |
| `create_today_talk` | Today talk permission family is absent |
| `disable_factory` | No independently confirmed backend permission for DisFactory |
| `disable_equipment_type` | No independently confirmed backend permission for DisEquipmentType |
| `delete_certificate` | No independently confirmed backend permission for DeleteCertificate |
| `disable_certificate` | No independently confirmed backend permission for DisCertificate |
| `disable_equipment` | No independently confirmed backend permission for DisEquipment |
| `disable_hazard_type` | No independently confirmed backend permission for DisHazardType |
| `disable_observation_type` | No independently confirmed backend permission for DisObserverationType |
| `disable_factory_item` | No independently confirmed backend permission for DisFactoryItem |
| `clone_factory_items` | No independently confirmed backend permission for CloneFactoryItems |
| `validate_bulk_employees` | No independently confirmed backend permission for CreateOrganizatoinEmployeeExcel |
| `disable_project_type` | No independently confirmed backend permission for DisOrganizatoinEmployee |
| `fetch_full_project_locations` | Project resource request must be scoped to its resource-specific permission |
| `create_drill` | Drill create permission is absent |
| `fetch_drills` | Drill operations differ from drill-type configuration and lack permission identifiers |
| `create_drill_plan` | Drill plan create permission is absent |
| `fetch_drill_plans` | Drill plan permission is absent |
| `fetch_drill_actions` | Drill action permission is absent |
| `create_drill_action` | Drill action create permission is absent |
| `delete_drill_action` | Drill action delete permission is absent |
| `delete_drill_plan` | Drill plan delete permission is absent |
| `create_observation` | No confirmed create permission for this feature |
| `fetch_observations` | No confirmed fetch permission for this feature |
| `fetch_observation_details` | No confirmed details permission for this feature |
| `update_observation` | No confirmed update permission for this feature |
| `delete_observation` | No confirmed delete permission for this feature |
| `disable_health_condition` | No independently confirmed backend permission for DisHealthConditions |
| `save_internal_audit_attendance` | Audit attendance permission is absent |
| `add_internal_audit_Participants` | Audit participant assignment permission is absent |
| `update_full_ncrs` | NCR correction needs its own backend operation permission |
| `create_internal_audit_report` | Audit report submission permission is absent |
| `clone_injury_types` | No independently confirmed backend permission for CreateInjuryClones |
| `fetch_ticket_types` | No confirmed fetch permission for this feature |
| `create_ticket_type` | No confirmed create permission for this feature |
| `fetch_ticket_type_details` | No confirmed details permission for this feature |
| `update_ticket_type` | No confirmed update permission for this feature |
| `delete_ticket_type` | No confirmed delete permission for this feature |
| `create_ticket_reply` | No independently confirmed backend permission for ReplaceTicket |
| `change_ticket_status` | No independently confirmed backend permission for CloseTicket |
| `toggle_observation_action_status` | Observation action status permission is absent |
| `toggle_observation_work_status` | Observation stop-work permission is absent |
| `set_investigation_task_verification` | No independently confirmed backend permission for SetInvestigationTaskVerification |
| `fetch_investigation_task_verifications` | No independently confirmed backend permission for FetchInvestigationTaskVerification |
| `change_meeting_task_status` | Task status needs a backend operation permission |
| `clone_warehouse_types` | No independently confirmed backend permission for AddWarehouseClones |
| `clone_drill_types` | No independently confirmed backend permission for CloneDrillTypes |
| `clone_ppe_items` | No independently confirmed backend permission for ClonePpeItems |
| `fetch_checklists` | No confirmed fetch permission for this feature |
| `create_checklist` | No confirmed create permission for this feature |
| `fetch_checklist_details` | No confirmed details permission for this feature |
| `update_checklist` | No confirmed update permission for this feature |
| `delete_checklist` | No confirmed delete permission for this feature |
| `close_investigation` | Investigation close permission is absent |
| `create_certificate_hierarchy` | No independently confirmed backend permission for addCertificateToHierarchy |
| `delete_hierarchy_certificate` | No independently confirmed backend permission for deleteCertificateToHierarchy |
| `change_notification_active_status` | No independently confirmed backend permission for ActiveNotificationPlan |
| `clone_all_data` | No independently confirmed backend permission for CloneAllData |
| `clone_meeting_types` | No independently confirmed backend permission for CloneMeetingTypes |
| `create_project_meeting` | Project meeting permission family is absent |
| `create_project_meeting_result` | Project meeting result permission is absent |
| `fetch_meetings` | Project meeting permission family is absent |
| `fetch_permit_type_details` | No confirmed details permission for ORG_PTW_TYPE |
| `clone_permit_types` | No independently confirmed backend permission for ClonePTWTypes |
| `create_permit_to_work_result` | Permit results need a distinct backend operation permission |
| `fetch_meeting_details` | Project meeting permission family is absent |
| `clone_ppe_activities` | No independently confirmed backend permission for clone_ppe_activity |
| `clone_ppe_tools` | No independently confirmed backend permission for clone_ppe_tool |
| `clone_document_categories` | No independently confirmed backend permission for clone_document_category |
| `clone_internal_audit_standards` | No independently confirmed backend permission for clone_audit_standard |
| `clone_internal_audit_activities` | No independently confirmed backend permission for clone_audit_activity |
| `clone_traning_topic` | No independently confirmed backend permission for clone_traning_topic |

This checkpoint was finalized at the user's request to finish the current work. Remaining individual reviews and backend-dependent scenarios are intentionally left open; no complete-coverage claim is made.
