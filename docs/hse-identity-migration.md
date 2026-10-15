# HSE.Cloud.AI global identity migration

Last updated: 2026-10-15

## Source and starting state

- Working branch: `hse-global-identity`, created from clean `project-styles-v2` at `f3f4a363e`.
- Canonical source inspected: `/home/techlab/Downloads/HSE_Projects_Studio_05_1_FIXED_EN.html` (501 lines, including embedded assets).
- Skill inspected: `hse-cloud-identity-skill-v2/hse-cloud-identity/SKILL.md` and all supporting reference/token guides.
- Exact reference values adopted: canvas `#f5f8fc`, surface `#ffffff`, ink `#10233f`, muted `#6b7b91`, border `#dfe7f1`, navy `#0e2a4d`, secondary navy `#183d68`, primary `#246bfe`, primary hover `#1f65f6`, cyan `#11a5c5`, success `#0aa778`, warning `#e69a18`, danger `#e14a57`, sidebar width `232px`, header height `72px`, large radius `22px`, and the reference shadow scales.
- Fonts available locally: Inter, Cairo, and URW DIN Arabic. Inter is the reference English family; Cairo is the global Arabic companion.

## Automated inventory

| Area                                 | Count / finding |
| ------------------------------------ | --------------: |
| Vue SFCs                             |           1,929 |
| Feature SFCs                         |           1,051 |
| Shared SFCs                          |             500 |
| View SFCs                            |             370 |
| Router records                       |             319 |
| CSS files                            |              17 |
| SCSS files                           |             275 |
| Inline `style` attributes            |             280 |
| Hardcoded hex occurrences            |           3,144 |
| Scoped component styles              |             829 |
| Unscoped component styles            |             152 |
| Table-bearing components             |             199 |
| Form/control-bearing components      |             531 |
| Dialog/overlay-bearing components    |             317 |
| Button-bearing components            |             491 |
| Tailwind arbitrary-value occurrences |             624 |

The hardcoded-color audit excludes no source areas. Values in charts, SVGs, images, status scales, and data-driven colors require semantic review and are not candidates for blind replacement.

## Architecture and component classification

- **Application entry and providers:** `src/main.ts`, `src/App.vue`, `src/router/`.
- **Application layout:** `src/shared/layouts/DashboardLayout.vue`, `src/shared/LayoutComponents/Header.vue`, `NewSidebar.vue`, `OrganizationSidebar.vue`, `AdminSidebar.vue`, `BreadCrumb.vue`, mobile navigation, notifications, language switcher, and footer.
- **Shared reusable UI:** 500 SFCs in `src/shared`, including form inputs, buttons/actions, helpers, dialogs, loaders, empty states, pagination, and layout primitives.
- **Pages/views:** 370 route wrapper SFCs in `src/views`; most delegate to feature presentation components.
- **Feature presentation:** 1,051 SFCs in `src/features`, including forms, tables, cards, dashboards, dialogs, reports, and business-flow components.
- **Global legacy styling:** `src/assets/styles/main.scss` imports 275 SCSS modules. Existing semantic variables are in `_variables.scss`.
- **Current UI libraries:** PrimeVue 4.3.9 styled mode with Aura; Tailwind 4.1.13 through the Vite plugin; Iconify plus the established custom SVG component library.
- **Existing identity work retained:** project-scoped identity tokens/controls and the system-identity customization feature.

## Design-system files

- [x] `src/assets/styles/design-system/tokens.css`
- [x] `src/assets/styles/design-system/typography.css`
- [x] `src/assets/styles/design-system/foundations.css`
- [x] `src/assets/styles/design-system/components.css`
- [x] `src/assets/styles/design-system/forms.css`
- [x] `src/assets/styles/design-system/tables.css`
- [x] `src/assets/styles/design-system/overlays.css`
- [x] `src/assets/styles/design-system/navigation.css`
- [x] `src/assets/styles/design-system/states.css`
- [x] `src/assets/styles/design-system/responsive.css`
- [x] PrimeVue preset in `src/config/hseCloudPreset.ts`
- [x] Tailwind v4 theme tokens in `src/assets/styles/tailwind.css`

The root `html.hse-cloud-identity` class makes the identity the application default and also reaches PrimeVue teleported overlays. Existing system-identity custom properties continue to override default brand values when administrators save an approved custom identity.

## Feature checklist

All feature roots inherit the global typography, palette, form, table, button, overlay, status, focus, responsive, and reduced-motion foundations. A checked global pass means the feature is covered by the default design-system cascade; route-specific visual QA is tracked separately.

- [x] EmployeeInterface (2 SFCs) — global pass
- [x] Home (23 SFCs) — global pass
- [x] SystemIdentity (5 SFCs) — compatibility retained
- [x] TopSlider (1 SFC) — global pass
- [x] auth (2 SFCs) — global pass
- [x] employee (7 SFCs) — global pass
- [x] notification (4 SFCs) — global pass
- [x] permission (6 SFCs) — global pass
- [x] setting (254 SFCs) — global pass
- [x] users (4 SFCs) — global pass
- [x] website (175 SFCs) — global pass
- [x] Organization (561 SFCs) — global pass
- [x] `_templateFeature` (7 SFCs) — development template inherits defaults

### Organization feature inventory

- [x] AttachmentMatrix (1)
- [x] AuditActivity (7)
- [x] AuditStandard (7)
- [x] Capa (6)
- [x] CheckList (6)
- [x] DocumentCategory (7)
- [x] DocumentRefrence (5)
- [x] DrillType (8)
- [x] EmployeesCertificates (11)
- [x] ForgetPassword (4)
- [x] Herikaly (10)
- [x] Injury (6)
- [x] Inspection (46)
- [x] InternalAudit (12)
- [x] Investigating (58)
- [x] MangementChangeTopicType (7)
- [x] MangementOfChange (4)
- [x] MeetingType (8)
- [x] ObservationFactory (49)
- [x] Operations (no SFCs)
- [x] OrganizationEmployee (24)
- [x] OrganizationLocation (7)
- [x] PPEActivity (7)
- [x] PPETool (7)
- [x] PTWType (7)
- [x] Partner (7)
- [x] Project (130; retains its detailed approved identity)
- [x] ProjectPrgoress (9)
- [x] ProjectZone (7)
- [x] Role (7)
- [x] Scope (7)
- [x] SerialNumber (2)
- [x] Shifts (4)
- [x] TaskReports (4)
- [x] Ticket (11)
- [x] TicketType (4)
- [x] TraningTopic (9)
- [x] VisitActivity (5)
- [x] VisitCategory (5)
- [x] VisitTheme (5)
- [x] WhereHouse (7)
- [x] WhereHouseType (7)
- [x] notificationPlan (2)
- [x] objectives (7)
- [x] ppeItem (8)

## Phase status

- [x] Repository and style inventory
- [x] Canonical reference extraction
- [x] Global tokens and typography
- [x] PrimeVue 4 preset integration
- [x] Tailwind 4 token integration
- [x] Application shell default identity
- [x] Shared buttons, controls, cards, tables, overlays, states
- [x] Global LTR/RTL and reduced-motion foundations
- [x] Route-level screenshots at 1920, 1440, 1280, 1024, 768, 390, and 320 CSS px
- [x] Authenticated interaction sampling across representative feature routes
- [x] Final typecheck, lint, build, and Playwright results after migration

## Baseline verification

- Production build before migration: passed with legacy invalid `:deep(...)` and `:placeholder` warnings.
- Production build after migration: passed in 27.77 seconds. The invalid-selector warnings were fixed; the existing large-chunk advisory remains.
- Global visual suite: 3/3 passed in 1.2 minutes. It covers login, dashboard, projects, project summary, employees, locations, equipment, incidents, investigations, inspections, reports, settings, RTL, and every requested viewport width.
- Existing Project interaction suite: 3/3 passed in 21.3 seconds after resolving a discovered overlay-font cascade conflict. It covers selects, calendars, keyboard/disabled/error/dark states, navigation, desktop/tablet/mobile, English, and Arabic.
- Changed TypeScript/test files: targeted ESLint passed with zero findings.
- Repository-wide ESLint baseline: failed with 5,871 existing findings (4,764 errors and 1,107 warnings). These are outside the design migration; no automatic fix was run.
- Repository-wide typecheck baseline: failed with 3,682 existing TypeScript errors across 848 source files. The production build and the changed-file checks pass; no unrelated business code was modified to mask the baseline.

## Visual QA log and known risks

- Screenshots are stored outside the repository in `/tmp/hse-global-identity` and `/tmp/hse-shell-identity`. Browser fixtures intercepted remote requests and did not write production data.
- Equipment and organization employee forms received dedicated sectioned layouts with identity headers, contextual field groups, responsive access/ownership cards, and focused desktop/mobile screenshot coverage.
- Verified screenshot routes: organization login, dashboard, project list, project summary, employees, locations, equipment, incidents, investigations, inspections, corrective reports, organization settings, and Project setup.
- Verified sizes: 1920, 1440, 1280, 1024, 768, 390, and 320 CSS px. The representative mobile pages have no document-level horizontal overflow.
- Verified LTR and RTL shell direction, English Inter typography, Arabic Cairo typography, navigation, controls, responsive cards/tables, empty states, selects, date overlays, and dark control states.
- The global cascade intentionally uses common structural classes and PrimeVue classes. Feature-specific CSS still wins where it represents business-specific composition.
- Legacy component colors remain in source for semantic charts, SVGs, images, and local layouts. The global token bridge replaces their shared variable values without destroying business color meaning.
- Known project baseline issues: repository-wide TypeScript and ESLint suites remain red; Vite reports existing chunks above 500 kB. No new runtime dependency was added.
