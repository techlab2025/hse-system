# HSE.Cloud.Ai organization dashboard redesign

## Approved reference and scope

The requested `design-references/hse-dashboard-target.png` was not present. The supplied image was located and inspected at **`design-references/HSE Safety Dashboard Overview.png`**. It is the visual reference for the implemented compact industrial hero, tinted KPI row, three-column analytics arrangement, ownership donut, category ranking, compact project table and operational side panels.

Implementation is in `src/features/Home/presentation/Components/OragnizationHome.vue`. Global header, sidebar, project selection, authentication and routing remain in their existing components. Concurrent unrelated workspace edits were preserved.

The reference's example numbers, historical curves, weather, relative timestamps, health grades and completion percentages were not copied into the application. Production components request the real existing APIs; fixture data lives exclusively under `scripts/dashboard` for repeatable tests and screenshots.

## Original problems

- A scheduled-inspection count was labelled inspection compliance.
- A zone/category response was drawn as a monthly-style visualization without historical data.
- Investigation `total` was shown with `%` although the client supplied no denominator or measure definition.
- Equipment inventory counts were labelled “most used,” despite no utilization series.
- Large project cards/carousels and chart containers made the page unnecessarily tall.
- Loading was tied to projects, potentially hiding independently available analytics; failures and missing fields could appear as blank cards or apparent zeros.
- Some controls, data models and visualizations lacked explicit permission, scope, null-handling or unit boundaries.

## New information architecture

| Approved section       | Implemented treatment                                                                                                                                              | Data integrity decision                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A / Header             | Compact welcome/organization overview, original industrial vector artwork, existing global project selection and small footer refresh control                  | Global project selector is reused; no decorative date filter or weather feed. Organization name is shown only when supplied by the user model. Client retrieval time is exposed only as refresh context, not backend event freshness. |
| B / KPIs               | Six supported counts: incidents, high-risk observations, delayed inspections, finished inspection results, expired certificate records and open corrective actions | These six fields actually exist. No sparklines or comparison arrows without historical records; certificate records are not called employees.                                                            |
| C / Safety performance | Chart.js grouped columns for every dataset size, with responsive location pagination                                                                           | Accurate categorical alternative to an unsupported line chart; no fictional months or trends.                                                                                                            |
| D / Inspection status  | Separate status bars plus the explicitly named scheduled-this-month count                                                                                          | New/in-progress/completed/canceled/delayed may overlap. No false donut or inferred compliance percentage. Finished results remain distinct from scheduled inspections.                                   |
| E / Ownership          | Compact SVG donut with total of reported ownership records, owned/rented counts and exact count-based shares; optional expandable zone/type detail                 | Requires both counts and a positive total for colored proportions. Never sums zone assignments to claim unique organization assets.                                                                      |
| F / Reported cases     | Top-six horizontal ranking of actual reported root-cause categories                                                                                                | Uses real category titles and counts, not screenshot categories; short lists remain compact.                                                                                                             |
| G / Corrective actions | Purple **open-count** tile with a concise management prompt and existing CAPA navigation                                                                            | The tile is a count, not a completion meter. Unavailable status rows are omitted. No completion percentage without matching total/closed cohort.                                                                                 |
| H / Workforce          | Compact active/inactive/expired certificate-record counts and reported record total                                                                                | No invented employee readiness or mutually exclusive training donut.                                                                                                                                     |
| I / Projects           | Five rows per server-paginated page, native project links, incident/inspection/equipment counts and clearly named setup progress                                   | No safety grades or synthetic health score. Missing progress/counts remain unknown; selected-project results exclude unrelated rows.                                                                     |
| J / Recent activity    | Compact operational-register navigation beneath project records, correctly named “Explore safety operations”                                                                                             | No fake activity descriptions, chronology or relative dates; backend activity-ledger contract supplied.                                                                                                  |
| K / Quick actions      | Permission-checked incident reporting, inspection creation, observation creation and corrective-action management                                                  | Existing routes only. There is no generic standalone CAPA-create route, so management opens its real register.                                                                                           |
| L / Reminders          | Count-level safety follow-up for reported high-risk observations, delayed inspections and expired certificates                                                     | No fabricated due dates, owners, expiring-soon window or unresolved-critical-risk claims. A real record worklist is specified separately.                                                                |

Longer metric explanations are available in keyboard-accessible “About these figures” disclosures. Headline labels retain the important distinction between setup, incidents, observations, results and certificate records.

## Component and data architecture

### Presentation components

Under `src/features/Home/presentation/Components/Dashboard/`:

- `DashboardPanel.vue`: consistent heading, authorized register links, independent skeleton/error/empty/access states, retry and expandable data notes.
- `DashboardMetric.vue`: tinted semantic KPI cards with large locale-formatted values and real navigation.
- `DashboardIcon.vue`: small consistent native SVG icon set.
- `DashboardIndustrialBanner.vue`: original vector decoration; no remote stock image or embedded screenshot data.
- `DashboardBars.vue`: accessible DOM-based categorical charts, explicit values and bounded internal scrolling for long datasets.
- `DashboardDonut.vue`: reactive SVG ownership proportions with counts, localized percentages and missing/zero handling.
- `DashboardSafety.vue`, `DashboardInspection.vue`, `DashboardEquipment.vue`, `DashboardCases.vue`, `DashboardCorrective.vue`, `DashboardWorkforce.vue`: independently scoped analytics treatments.
- `DashboardProjects.vue`: compact paginated portfolio with valid project navigation and permission-aware columns.
- `DashboardActivities.vue`, `DashboardQuickActions.vue`, `DashboardAttention.vue`: operational navigation and truthful activity/reminder fallbacks.
- `dashboard.css`: dashboard-scoped brand/semantic styling and approved desktop/tablet/mobile composition.

`HomeSetupHint.vue` and `EmployeeTasksButton.vue` remain integrated with their existing behavior. The setup hint is inline; analytics are not covered by a blocking onboarding overlay.

### Read pipeline

| Layer                                                                     | New file                                                           |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Immutable request scope                                                   | `Home/core/params/OrganizationDashboardParams.ts`                  |
| Existing authenticated POST transport, no global loading modal            | `Home/data/ApiService/OrganizationDashboardApiService.ts`          |
| Typed read models, strict count/null validation and response adapters     | `Home/data/Model/OrganizationDashboardModel.ts`                    |
| Existing-envelope and pagination parsing                                  | `Home/domain/repositories/OrganizationDashboardRepo.ts`            |
| Dashboard fetch use case                                                  | `Home/domain/usecase/FetchOrganizationDashboardUseCase.ts`         |
| Per-mount request coalescing and bounded memory cache                     | `Home/presentation/Controllers/OrganizationDashboardController.ts` |
| Reactive resource state, project/auth generations, pagination and refresh | `Home/presentation/composables/useOrganizationDashboard.ts`        |
| Explicit read/create permissions and mixed-source safety gate             | `Home/presentation/composables/dashboardPermissions.ts`            |

Four existing read resources are requested independently: the mixed home summary, zone report counts, equipment statistics and paginated projects. API names, Bearer authentication, POST conventions and organization scoping are preserved. A dashboard-specific API wrapper avoids the global project-list loading modal and long-lived list cache when refreshing analytics. No proposed backend endpoint is silently called.

The old homepage-only composition through `StaticsCardPerMonth`, `StaticCardsFullDetails`, `EquipmentStatics`, `InvestegationStatics`, `ProjectsStatistics`, `HomeCards` and `HomeSkelaton` is replaced. Their files remain available for other consumers; unrelated components were not deleted. The ambiguous investigation-percentage request is no longer made.

## Accuracy, security and performance

- Null, missing, blank, malformed, negative or non-integer count values remain unknown; actual zero remains zero.
- Incomplete part-to-whole data never produces a colored total or a fake zero rate.
- Inspection/certificate statuses are not added into unverifiable denominators.
- Every source has independent loading/error/empty states. Retrying a panel reloads only its source; other sources remain available.
- One immediate scope watcher replaces parallel on-mount/project watchers. In-flight requests for the same resource/scope/page are coalesced.
- Successful results have a 30-second per-dashboard-mount cache, bounded to 24 entries. Failed requests are not cached. Explicit refresh bypasses successful cache entries.
- Project/auth/organization generation checks prevent late responses from overwriting a new scope. Auth-context changes create a new controller; data is not persisted to local storage.
- Pagination loads only the project resource. Language changes relabel the view without refetching the same analytics.
- The current mixed summary includes several permission domains. Until the backend supports safe field-level masking, it is withheld unless all constituent reads are allowed. Unauthorized resources are not requested; unauthorized quick actions and links are not displayed.
- Charts use small SVG/DOM components and existing Vue primitives, with no new runtime dependency, continuous animation, chart instance or resize listener to leak.
- Category charts use zero-based proportional bars and exact text values; large breakdowns scroll within the panel. Single-category rankings do not acquire giant fixed-height plot areas.

## Localization, accessibility and responsiveness

New text lives in the existing `command` namespace in both `src/locales/en.json` and `ar.json`. The singleton locale, root direction and organization identity tokens remain the owners of language and branding.

Layout uses logical positioning and spacing; Arabic mirrors reading/navigation direction while preserving industrial artwork and nondirectional icons. Numbers use `Intl.NumberFormat`, text/IDs use directional isolation, and provided bilingual record titles use their supplied locale fields. User-entered values are preserved.

Controls have accessible names, native focus treatment and disabled states. Charts have readable DOM values; decorative visuals are hidden appropriately. SVG ownership output has an accessible total and a textual legend. Tables have scoped headers and a named internal scroll region. Notes use native keyboard-operable disclosures.

The responsive grid targets 320, 375, 768, 1024, 1440 and 1920 pixels in English/LTR and Arabic/RTL. KPI columns adapt from six to three to two; analytics collapse from three desktop columns to two/single-column layouts, with table scrolling contained inside its card.

## Verification

Final check results and visual evidence are recorded in `docs/dashboard/verification.json` and `docs/dashboard/screenshots/`. Results are populated from actual executed checks, not assumed from compilation.

Commands:

```sh
npm run dashboard:test
npm run build
npm run preview -- --host 127.0.0.1 --port 5185 --strictPort
DASHBOARD_TEST_URL=http://127.0.0.1:5185 npm run dashboard:browser
npm run i18n:test
npx vue-tsc --noEmit --project tsconfig.app.json
```

The browser suite uses explicitly isolated HTTP fixtures and a localhost guard; production components contain no fixture import. It checks values versus percentages, response failures, empty/partial/single/large data, genuine ownership shares, valid quick-action routes, partial/create-only permissions, project races, pagination, language switching, request counts and all six screen widths. Screenshots use labelled fixture data to evaluate presentation, not to claim production organization performance.

The production URL was opened read-only without supplied credentials in the automation context. The application shell loaded but no authenticated organization dashboard was available; authenticated production data reconciliation remains unverified. No production records were created or edited.

## Remaining limits and integration roadmap

1. Backend reporting periods, as-of semantics, field-level permission masking and definition versions are missing from the current aggregate contracts. The UI labels a returned snapshot rather than inventing a reporting range.
2. Historical trends, confirmed inspection compliance and investigation completion need defined series/cohorts. The frontend deliberately uses current categorical counts instead.
3. CAPA closure/overdue totals, unique-employee readiness, record-level urgent reminders and a chronological activity feed require backend work. Unsupported optional analytics are omitted; detailed contract limitations are documented separately.
4. Ownership percentages use the returned owned/rented aggregate. Unique-asset aggregation and unclassified ownership semantics must be confirmed server-side; zone counts are never used as a substitute for unique assets.
5. Full-project TypeScript and existing bundle-size warnings are reported separately from dashboard-specific checks. Passing the production bundle does not establish a clean application-wide type check.
6. A full authenticated production-data reconciliation, every permission combination and every browser has not been performed. Production readiness is limited to the completed checks.

Implementation-ready schemas, formulas, database/index guidance, priorities and backend task acceptance criteria are in **`ORGANIZATION_DASHBOARD_BACKEND_REQUIREMENTS.md`**, including the new activity-timeline proposal.

Recommended next integrations: (1) defined/masked overview, (2) true safety trends, (3) inspection-occurrence and CAPA cohorts, (4) authorized owner/deadline attention queue, (5) committed activity ledger. Equipment/workforce assurance follows current requirement/evidence semantics; exposure-based injury rates follow approved classification and worked-hour collection. No opaque composite safety score is proposed.


## Visual acceptance correction — 27 October 2026

The first implementation did not meet the requested visual standard. Rendered comparison showed 10–11px type, under-emphasized KPI cards, repetitive thin progress bars, a sparse root-cause card reserving a whole grid position, and unavailable CAPA/activity content occupying prominent space. This correction modifies the active dashboard directly.

### Explicit visual fidelity review

| Area | Corrected implementation and comparison with supplied reference |
| --- | --- |
| Header | 28px welcome, 14px introduction, original industrial vector with stronger blue contrast, organization-specific copy and compact refresh. Artwork is illustrative rather than a replica of the reference photograph. |
| KPI cards | 36px values, 40px colored icons, tinted layered surfaces, subtle decorative rings, stronger labels and metric-specific supporting copy. Rings are decorative, not invented sparklines or scores. |
| Charts | Real location data now uses Chart.js grouped columns with a zero-based count axis, exact counts in shared tooltips, a textual legend and preserved labels. A single location has three separated bars; larger sets use responsive pagination without changing to stacked progress bars. |
| Grid | Three primary analytics cards, then two operational cards, followed by a wide portfolio and narrow action/reminder stack. The root-cause ranking is embedded under its related safety chart rather than occupying an otherwise empty grid cell. |
| Colors | Consistent navy/blue/teal foundation; red and amber highlight incident/risk/expiry signals. Expired certificate KPI changed from teal to amber. |
| Typography | Body/table 13–14px, supporting copy 12px, panel headings 16–18px and main heading 28px; responsive layouts preserve readable text rather than reducing the whole page. |
| Icons | Colored icon tiles are larger and consistent across metrics, projects and actions. Only directional navigation mirrors. |
| Spacing | 18–20px grid gaps and panel padding; content-led heights, compact one-category rankings, and no fixed-height blank unsupported charts. |
| Shadows | Subtle cool shadows and lightly elevated surfaces, with stronger but controlled icon accents. |
| Borders | 14px card corners, pale blue surface borders and semantic tinted KPI/action borders. |
| Information density | Unknown closed/overdue CAPA rows and the unavailable activity placeholder were removed. Source-register links are a compact companion to project records. Certificate counts use independently scaled comparison bars, without false part-to-whole claims. |
| Composition | Richer first-screen presentation with clear executive/analytics/operational hierarchy. Exact reference chart types differ where backend cohorts or historical data are absent. |

Components directly redesigned: `OragnizationHome.vue`, `DashboardMetric.vue`, `DashboardSafety.vue`, `DashboardCases.vue` integration, `DashboardCorrective.vue`, `DashboardWorkforce.vue`, `DashboardProjects.vue`, `DashboardActivities.vue`, and the scoped `dashboard.css`. New reusable presentation component: `DashboardCategoryChart.vue`. API/service/repository contracts are unchanged by this visual correction.

### Browser evidence

The screenshot capture script exports English/LTR and Arabic/RTL at **375, 768, 1024, 1440, 1536 and 1920px**. See `docs/dashboard/screenshots/screenshots.json` for exact sizes and overflow observations. These are explicitly labelled local-production fixture captures, not customer analytics. The browser regression suite additionally checks 320px, source request counts, race handling, permission boundaries, and chart/count correctness.

Desktop and mobile screenshots were inspected against the supplied reference. The corrected presentation is substantially richer than the first implementation; it does not claim pixel identity with the photographic reference. Production-authenticated analytics reconciliation remains unverified.

### Executed checks

- Production build: passed; existing application chunk-size warnings remain.
- Targeted dashboard ESLint: passed.
- Dashboard model/controller unit suite: 15 passed.
- Existing localization contract suite: 14 passed.
- Browser regression/visual scale suite: **17 passed**, including mobile drawer paint/reopen and table readability; exact results are recorded in `docs/dashboard/verification.json`.
- Full repository TypeScript check: **3,606 repository diagnostics, zero diagnostics in the implemented dashboard files**; counts are separately recorded in the verification artifact. No claim of a clean repository-wide type check.


A second visual pass caught a shared-layout defect that the initial no-overflow check missed: the closed mobile sidebar container retained a viewport-wide navy background despite the drawer itself being offscreen. A `:has(.org-command)`-scoped correction hides only this dashboard's closed mobile container; opening the actual drawer releases the rule. Other pages and desktop navigation are unaffected. The project table now keeps a readable 640px minimum within its named internal scrolling region rather than squeezing Arabic column headings into character-wide columns. A dedicated browser regression verifies both conditions and release of the closed-drawer rule.


Concurrent local edits intentionally hide the hero scope/timestamp/refresh elements; those comments were preserved. The refresh control is available in the dashboard footer and retains scope/retrieval context in its tooltip. No duplicate project selector was introduced.


## Grouped safety chart correction

`DashboardCategoryChart.vue` now uses the application's installed **Chart.js** library (also consumed by existing PrimeVue Chart components). It creates three unstacked datasets from the existing `fetch_home_observation_types_with_zones_statices` response: `all_observations.accidents` → Incidents, `hazard` → Hazards, and `observation` → Observations. No historical dates are present in this contract.

- Exact series colors: incidents `#F04452`, hazards `#F59E0B`, observations `#2864F0`.
- Rounded grouped bars, zero-based integer count axis, named location axis, subtle dashed grid and a responsive plot surface.
- Shared index tooltips preserve full location names and format values in the active locale. No fabricated totals or timeline.
- A single location always renders three distinct bars. Two/many locations use the same chart; a ResizeObserver sets an appropriate number of locations per page so bars and labels remain readable. Paging operates on already loaded data and does not make additional API calls.
- Arabic moves the value axis to the right, reverses displayed categorical reading order and localizes tooltip direction; original user-entered location names are preserved.
- A keyboard-operable data disclosure provides exact visible-page values and explicit unknown-value markers. Unknown values remain null in Chart.js, not zero.
- The Chart.js instance updates in place for page/locale/data changes and is destroyed on unmount; the observer is disconnected.
- `DashboardSafety.vue` no longer switches to stacked/progress bars at one or many locations. Its root-cause subsection is rendered only when the backend actually provides root-cause records; absent categories reserve no section.

Focused screenshots are exported by `scripts/dashboard/capture-safety-chart.mjs`: single location, multiple locations, many-location RTL pagination, mobile RTL and a hover tooltip. These are isolated local fixture screenshots, explicitly not production metrics. Compare the plot's palette, white tooltip, clean grid, rounded marks and readable spacing with the supplied reference; the plot is categorical rather than a fake historical replica.

The historical line chart remains dependent on an actual historical endpoint. Section **L** of `ORGANIZATION_DASHBOARD_BACKEND_REQUIREMENTS.md` specifies its route, filter parameters, full envelope, bucket rules, tenant/project constraints, permissions and Laravel aggregation acceptance tests. No request to an unimplemented endpoint was introduced.


### Focused chart visual review results

Inspected `safety-chart-one-location.png`, `safety-chart-tooltip.png`, `safety-chart-many-locations-rtl.png` and `safety-chart-mobile-rtl.png` against `design-references/HSE Safety Dashboard Overview.png`. The rendered component now has the reference's clean white plot, restrained dotted grid, semantic color rhythm, readable typography, and bordered white multi-series tooltip. One location visibly renders three separated marks. RTL places the count axis on the right and retains full original location names in tooltips/data. Large sets retain the same chart with a bounded plot and paging controls. No empty root-cause block is present in these absent-category captures. The visual differs intentionally from the reference's historical line chart because the current response has no temporal dimension.

The browser suite reads rendered canvas pixels to verify all three exact semantic colors and checks the one-location data table against the supplied response counts. It also verifies missing root causes produce no subsection, many-location paging changes the displayed source records, and the plot stays below 350px rather than turning into a tall empty container. Full dashboard screenshots were regenerated for both languages at all six capture widths.

Final grouped-chart verification: production build passed; targeted lint passed; **17 browser tests, 15 model/controller tests and 14 localization contract tests passed**. Existing full-project TypeScript diagnostics remain outside the implemented dashboard files. Five focused chart screenshots and twelve full-dashboard screenshots are saved under `docs/dashboard/screenshots/`; exact verification metadata is in `docs/dashboard/verification.json`.
