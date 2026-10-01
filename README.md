# HSE System

HSE System is a web-based Health, Safety, and Environment management platform for organizations, projects, employees, and safety teams. It centralizes project setup, observations, hazards, incidents, inspections, audits, investigations, corrective actions, PPE, permits, training, documents, and operational reporting in one application.

The application supports separate administrator and organization experiences, permission-based access, English and Arabic interfaces, light and dark themes, responsive layouts, real-time notifications, document exports, and project-scoped safety workflows.

## Contents

- [Product overview](#product-overview)
- [Main features](#main-features)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Available commands](#available-commands)
- [Application routing](#application-routing)
- [API and data flow](#api-and-data-flow)
- [State management](#state-management)
- [Authentication and permissions](#authentication-and-permissions)
- [Localization and themes](#localization-and-themes)
- [Notifications](#notifications)
- [Styling and UI](#styling-and-ui)
- [Testing and quality](#testing-and-quality)
- [Creating a feature](#creating-a-feature)
- [Production deployment](#production-deployment)
- [Developer documentation](#developer-documentation)
- [Contribution guidelines](#contribution-guidelines)

## Product overview

The system is organized around three main experiences:

1. **Organization workspace** — daily HSE operations, project management, employees, inspections, observations, incidents, investigations, and reports.
2. **Administration workspace** — organizations, subscriptions, catalogs, system configuration, templates, and website content.
3. **Employee workspace** — employee-focused tasks, certificates, assigned work, and safety activities.

Most operational records can be scoped to a project, location, zone, employee, team, or equipment item. The application uses shared filters and a persisted selected-project context so users can move between related workflows without repeatedly selecting the same project.

## Main features

### Project management

- Create and manage projects through a guided setup flow.
- Configure project basics, holidays, positions, teams, employees, and equipment.
- Maintain project locations, zones, hierarchy, and team assignments.
- View project summaries, safety statistics, operational statistics, and quick links.
- Track project setup progress and continue incomplete setup steps.
- Manage project meetings, objectives, risk assessments, drills, inductions, and resources.
- Open project-scoped inspections, audits, observations, incidents, permits, and reports.

### PPE management

- Configure PPE activities, PPE tools, PPE items, and PPE conditions.
- Build project-specific activity/tool matrices.
- Assign or remove PPE tools for an activity.
- Record PPE deliveries for project employees.
- Review employee delivery history across multiple PPE activities.
- Support both legacy single-activity and current multi-activity delivery responses.

### Observations, hazards, and incidents

- Create and manage observations, hazards, and incidents.
- Select the related project and zone.
- Record dates, time, location, severity, likelihood, risk level, and action status.
- Capture witnesses, injuries, fatalities, equipment, images, and supporting details.
- Support staff and non-staff people by employee ID or manually entered name.
- Create follow-up investigations or corrective actions when required.
- Filter records by project, zone, date, status, and type.

### Inspections and audits

- Create organization inspections and project audits.
- Browse **All Tasks**, **My Tasks**, and **Submitted Tasks**.
- Filter by project, zone, date, and inspection type.
- Reuse the active project when opening an inspection from project context.
- Preview grouped and ungrouped template questions in read-only mode.
- View inspection tasks, results, logs, and details.
- Use contextual empty states for new, filtered, and completed-result views.
- Restrict create actions through the permission system.

### Investigations and CAPA

- Manage investigations, investigation meetings, tasks, and results.
- Record witnesses, evidence, causes, findings, and attachments.
- Create corrective and preventive actions.
- Track assigned employees, due dates, completion state, and result history.
- Connect investigations to observations or incidents.

### Permit to work

- Configure permit-to-work types and templates.
- Create and manage project permits.
- Answer permit templates and track permit-specific project data.
- Access permit workflows directly from project summaries.

### Workforce and organization structure

- Manage organization employees and employee details.
- Maintain hierarchy, positions, roles, teams, shifts, and locations.
- Assign employees to projects, zones, teams, meetings, and safety actions.
- Manage employee certificates and health-related information.
- Provide an employee-specific operational interface.

### Equipment, warehouse, and assets

- Manage equipment, equipment types, factories, and factory items.
- Assign equipment to projects and zones.
- Maintain warehouse and warehouse-type records.
- Import and export supported records through Excel workflows.

### Supporting HSE modules

- Management of change.
- Leadership visits and visit configuration.
- Today talks and training topics.
- Injury and incident categories.
- Root causes, hazard types, observation types, and methods.
- Checklists, attachment matrices, and document references.
- Notification plans, serial-number settings, and task reports.
- Tickets with screenshot capture for support workflows.

### Administration and public content

- Manage organizations, administrators, roles, and permissions.
- Configure subscriptions and subscription applications.
- Maintain catalogs, templates, project types, industries, locations, and languages.
- Manage public website content such as services, FAQs, blogs, pricing, banners, features, privacy, and terms.

## Technology stack

| Area              | Technology                                              |
| ----------------- | ------------------------------------------------------- |
| Application       | Vue 3 Composition API and TypeScript                    |
| Build tool        | Vite with Rolldown                                      |
| Routing           | Vue Router                                              |
| State             | Pinia with persisted state                              |
| UI components     | PrimeVue with Aura theme                                |
| Styling           | SCSS, CSS custom properties, and Tailwind CSS utilities |
| Localization      | Vue I18n                                                |
| HTTP              | Axios and Fetch API                                     |
| Real-time updates | STOMP over WebSocket                                    |
| Charts            | Chart.js and ApexCharts                                 |
| Rich text         | Quill                                                   |
| Documents         | XLSX, JSZip, jsPDF, html2canvas, and FileSaver          |
| Media             | Cropper.js, Lottie, and Swiper                          |
| Browser testing   | Playwright                                              |
| Code quality      | ESLint, Prettier, and vue-tsc                           |

## Architecture

Business features generally follow a layered structure:

```text
Feature/
├── Core/
│   ├── Enums/
│   └── params/
├── Data/
│   ├── apiServices/
│   └── models/
├── Domain/
│   ├── repositories/
│   └── useCase/
└── Presentation/
    ├── components/
    └── controllers/
```

### Layer responsibilities

- **Core** contains request parameters, enums, constants, and feature contracts.
- **Data** contains API service implementations and response models.
- **Domain** connects repositories to use cases and parses transport data into application models.
- **Presentation** contains Vue components, page state, and controllers used by the UI.

The common request flow is:

```text
Vue component
  → presentation controller
  → domain use case
  → repository
  → API service
  → network service
  → backend API
```

Responses travel back through the repository parser and are exposed as a shared data state such as initial, loading, success, empty, or failed. UI pages render those states through reusable components such as `DataStatusBuilder.vue`, loaders, empty states, and failure states.

## Project structure

```text
hse-system/
├── public/                       # Static public files
├── scripts/                      # Feature generator and Playwright audits
├── src/
│   ├── assets/
│   │   ├── fonts/                # Inter, Cairo, and URW font assets
│   │   ├── images/               # Application images
│   │   ├── lotties/              # Lottie animations
│   │   └── styles/               # Global SCSS, component styles, themes
│   ├── base/                     # Shared architecture and networking base classes
│   │   ├── Data/                 # API service interfaces and common models
│   │   ├── Domain/               # Repository and use-case foundations
│   │   ├── Presentation/         # Base controllers, dialogs, and utilities
│   │   └── core/                 # Network structures, parameters, constants
│   ├── components/               # General reusable components
│   ├── composables/              # Theme, identity, and notification composition
│   ├── config/                   # Runtime and WebSocket configuration
│   ├── constant/                 # Navigation and permission constants
│   ├── documentations/           # Feature-specific internal documentation
│   ├── features/                 # Business features grouped by domain
│   │   ├── Organization/         # Organization and HSE operational features
│   │   ├── setting/              # Shared configuration features
│   │   ├── users/                # Administration and user management
│   │   ├── website/              # Public website content management
│   │   ├── auth/                 # Authentication
│   │   ├── permission/           # Permission management
│   │   └── _templateFeature/     # Feature scaffolding template
│   ├── locales/                  # English and Arabic translations
│   ├── plugins/                  # Application plugins and auto-translation
│   ├── router/                   # Router, guards, and grouped route definitions
│   ├── services/                 # WebSocket and push notification services
│   ├── shared/                   # Shared forms, layouts, helpers, and icons
│   ├── stores/                   # Pinia stores
│   ├── types/                    # Shared TypeScript types
│   ├── utils/                    # Shared utilities
│   ├── views/                    # Route-level views
│   ├── App.vue                   # Root UI shell
│   └── main.ts                   # Application bootstrap
├── Dockerfile                    # Multi-stage production image
├── docker-compose.yml            # Local container runner
├── nginx.conf                    # SPA fallback configuration
├── playwright.config.ts          # Browser audit configuration
├── vite.config.ts                # Vite plugins and chunk configuration
└── package.json                  # Dependencies and commands
```

## Getting started

### Requirements

- Node.js `20.19+` or `22.12+`
- npm
- Access to the configured HSE backend API
- Google Chrome for the configured Playwright audit suite

### Install dependencies

```bash
npm ci
```

Use `npm install` when intentionally changing dependencies and regenerating `package-lock.json`.

### Start development

```bash
npm run dev
```

Vite prints the local development URL after startup.

### Create a production build

```bash
npm run build
```

The compiled application is written to `dist/`.

### Preview the production build

```bash
npm run preview
```

### API configuration

The primary backend URL is currently defined in:

```text
src/base/core/networkStructure/baseUrl.ts
```

Endpoint paths are centralized in:

```text
src/base/core/networkStructure/apiNames.ts
```

Do not commit credentials, access tokens, or environment-specific secrets. Authentication headers are created by the shared network header handler from the active user session.

## Available commands

| Command                            | Purpose                                             |
| ---------------------------------- | --------------------------------------------------- |
| `npm run dev`                      | Start the Vite development server                   |
| `npm run build`                    | Create a production build                           |
| `npm run build-only`               | Create a production build without additional checks |
| `npm run preview`                  | Preview the production build locally                |
| `npm run type-check`               | Run Vue and TypeScript checks                       |
| `npm run lint`                     | Run ESLint and apply supported fixes                |
| `npm run format`                   | Format files under `src/` with Prettier             |
| `npm run theme:migrate`            | Migrate style colors to identity tokens             |
| `npm run create:feature -- <name>` | Create a feature from `_templateFeature`            |
| `npx playwright test`              | Run browser-based UI audits                         |

## Application routing

Routes are lazily loaded and grouped into three sets:

- `src/router/routes/admin/` for administrator functionality.
- `src/router/routes/organization/` for organization and HSE functionality.
- `src/router/routes/shared/` for reusable settings exposed in both workspaces.

Main route roots:

| Route                 | Purpose                 |
| --------------------- | ----------------------- |
| `/login/admin`        | Administrator login     |
| `/login/organization` | Organization login      |
| `/admin`              | Administrator workspace |
| `/organization`       | Organization workspace  |
| `/forget-password`    | Password recovery       |

The global authentication guard redirects unauthenticated users to the correct login experience and directs employee accounts to the employee interface when appropriate. Unknown routes render the not-found page.

When adding a page:

1. Create or reuse the feature presentation component.
2. Add the route to the correct route-group file.
3. Use lazy imports for route-level views.
4. Add permission constants and navigation entries when required.
5. Preserve project and route query context for project-scoped workflows.

## API and data flow

### Request parameters

API requests are represented by parameter classes implementing the shared `Params` contract. Each parameter class maps application properties to the backend payload through `toMap()`.

```ts
class ExampleParams implements Params {
  constructor(public projectId: number) {}

  toMap() {
    return { project_id: this.projectId }
  }
}
```

Keep backend naming differences inside parameter and model mappers instead of leaking raw API keys throughout Vue components.

### API services

Feature API services extend the common service interface and define:

- Endpoint URL.
- HTTP method.
- Authentication requirement.
- Request parameter object.
- Optional loader and header behavior.

The network layer supports JSON and form-data requests using `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.

### Repositories and models

Repositories parse API responses through `onParse()`. Models expose normalized camelCase properties to components while accepting backend-compatible snake_case data in `fromMap()`.

For changing API responses, prefer backward-compatible normalization in the model or repository. For example, PPE delivery models accept both one activity and an array of activities.

### Controllers and UI state

Presentation controllers expose reactive data states to Vue components. Use the shared state components instead of manually duplicating loading and error handling:

- `DataStatusBuilder.vue`
- `TableLoader.vue`
- `DataEmpty.vue`
- `DataFailed.vue`
- `Pagination.vue`

## State management

Pinia is installed with persisted-state support. Important stores include:

| Store              | Responsibility                               |
| ------------------ | -------------------------------------------- |
| `user.ts`          | Authentication state and current user        |
| `ProjectSelect.ts` | Persisted active project and project helpers |
| `ProjectStatus.ts` | Project setup/application progress           |
| `TicketStor.ts`    | Ticket dialog and screenshot capture         |
| `PrintPart.ts`     | Print-related state                          |

Use local component state for page-only behavior and Pinia for state shared across routes or sessions.

## Authentication and permissions

- Authentication state is stored in the user store.
- The router guard protects administrator and organization routes.
- Permission codes are defined in the permission enum and permission constants.
- UI actions are guarded through `PermissionBuilder.vue`.
- Backend authorization remains authoritative; hiding a control in the UI is not a replacement for API authorization.

When adding a protected action, apply permission checks to the action itself and to related navigation entries.

## Localization and themes

### Localization

- English translations: `src/locales/en.json`
- Arabic translations: `src/locales/ar.json`
- Selected language is stored in `localStorage` under `lang`.
- Arabic automatically sets the document direction to RTL.
- English uses LTR direction.
- Arabic is currently the fallback locale.

Use `$t()` in templates and `useI18n()` in scripts. Add new user-facing strings to both locale files.

### Theme and identity

- PrimeVue uses the Aura preset.
- Dark mode is activated with `[data-theme="dark"]`.
- Theme state is initialized through `useThemeMode()`.
- Organization identity is loaded through `useSystemIdentity()`.
- Prefer semantic CSS variables such as `--PrimaryColor`, `--surface-1`, `--text-strong`, and `--main-border` over hardcoded colors.
- Respect RTL layouts by using logical properties such as `margin-inline-start` and `inset-inline-end`.

## Notifications

The application combines fetched notifications with real-time STOMP/WebSocket updates.

Notification capabilities include:

- Direct, broadcast, and pending notification channels.
- Unread/read counters.
- Toast and optional browser notifications.
- Automatic reconnection and notification socket token refresh.
- Navigation from notifications to related records.
- Mark-as-read API requests using the notification `messageId`.

Relevant files:

```text
src/services/WebSocketNotificationService.ts
src/services/PushNotificationService.ts
src/composables/useIntegratedNotifications.ts
src/shared/LayoutComponents/Notifications.vue
src/config/websocket.ts
```

## Styling and UI

The UI combines global SCSS modules, scoped component styles, PrimeVue components, and Tailwind utilities.

Main style entry points:

```text
src/assets/styles/main.scss
src/assets/styles/tailwind.css
src/assets/styles/theme/_dark_mode.scss
```

Guidelines:

- Reuse shared buttons, inputs, dialogs, tables, pagination, and status components.
- Use scoped styles for feature-specific presentation.
- Use global SCSS only for reusable design patterns.
- Verify desktop, tablet, and mobile layouts.
- Preserve keyboard focus states and meaningful labels.
- Add reduced-motion behavior for nonessential animation.
- Confirm new styles in both light and dark themes.
- Confirm both LTR and RTL layouts.

The production build separates major vendor groups into Vue, PrimeVue, charts, documents, editor, animation, and real-time chunks.

## Testing and quality

### Type checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

The lint command applies automatic fixes. Review the resulting diff before committing.

### Formatting

```bash
npm run format
```

To format only changed files, call Prettier directly with their paths.

### Browser audits

Playwright is configured to run tests from `scripts/` using desktop Chrome. Current browser audits cover localization UI and mobile responsiveness.

```bash
npx playwright install chrome
npx playwright test
```

### Recommended verification before a pull request

```bash
npm run type-check
npm run build
npx playwright test
```

Also manually verify the affected workflow, API payload, permissions, responsive layout, dark mode, and Arabic direction when relevant.

## Creating a feature

The repository contains a feature generator based on `src/features/_templateFeature`.

```bash
npm run create:feature -- exampleFeature
```

Multiple features can be generated in one command:

```bash
npm run create:feature -- firstFeature secondFeature
```

After generation:

1. Rename generated concepts where the template name does not match the domain.
2. Define request parameter classes and response models.
3. Add the API endpoint to `apiNames.ts`.
4. Implement the API service, repository, use case, and controller.
5. Build presentation components and status handling.
6. Register routes and permissions.
7. Add English and Arabic translations.
8. Test the success, empty, loading, and failed states.

## Production deployment

### Docker

The included Dockerfile builds the Vue application with Node and serves the generated SPA through Nginx.

```bash
docker compose up --build
```

The compose configuration exposes the application at:

```text
http://localhost:3000
```

Nginx uses an SPA fallback so Vue Router routes resolve to `index.html`.

### Manual static deployment

```bash
npm ci
npm run build
```

Deploy the contents of `dist/` to a static host configured to fall back to `index.html` for unknown paths.

## Developer documentation

Additional documentation is available in the repository:

- `src/documentations/project_flow_documentation.md`
- `src/documentations/project_summury_details.md`
- `src/documentations/mangement_of_change.md`
- `src/documentations/objectives_documentation.md`
- `Crud_handle.md`
- `custom_endpoints_handel.md`
- `corrective-previntave.md`
- `equipment.md`
- `hazerd.md`
- `incedant.md`
- `observation.md`
- `today-talk.md`
- `GITHUB_TAG_RELEASE_NOTES.md`

Some legacy filenames and API keys intentionally retain existing spellings such as `Incedant`, `Mangement`, `Herikaly`, and `zoon`. Avoid broad renames unless the router, backend contract, imports, translations, and persisted data are migrated together.

## Contribution guidelines

1. Create a branch from the active development branch.
2. Keep changes scoped to one feature or fix.
3. Follow the existing layered feature architecture.
4. Preserve unrelated working-tree changes.
5. Normalize API changes in params, models, or repositories.
6. Reuse shared UI and data-state components.
7. Add translations for all new user-facing text.
8. Verify permissions and project context.
9. Run appropriate checks before committing.
10. Write a clear commit message and update release notes for user-facing changes.

For release summaries covering recent Project, PPE Matrix, and Inspection work, see [GITHUB_TAG_RELEASE_NOTES.md](./GITHUB_TAG_RELEASE_NOTES.md).
