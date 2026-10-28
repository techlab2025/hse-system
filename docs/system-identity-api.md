# System Identity API — backend handoff

This contract connects `src/views/Organization/SystemIdentity.vue` to an organization-wide saved identity. The frontend integration is implemented; the backend must implement the two routes below. Endpoint spelling is intentional: **`creat_system_identity`**, without the final `e` in `create`.

## Code-only local storage / API setting

At the top of `src/views/Organization/SystemIdentity.vue`, change this boolean:

```ts
export const USE_SYSTEM_IDENTITY_API = false
```

- **False (current default):** load/save `hse-system-identity` locally, and remove that key on Reset. No identity fetch or save requests are made.
- **True:** fetch after organization login before navigating, restore on authenticated startup, and use the two endpoints for Save and Reset, with the cache/failure behavior described below. Requests are shared within the same session. A fetch failure keeps the matching cache or HSE defaults and allows login to finish.

There is no UI switch. `App.vue` reads this exported constant before loading the organization identity, so it controls startup as well as the editor. Previous `hse-system-identity-use-api` browser preferences are ignored. This setting is not included in either API request. Change the code and rebuild for deployment.

## Routes and authentication

Base URL: `https://api.hse.techlabeg.com/organization/`.

| Method | Endpoint                | Purpose                                                               |
| ------ | ----------------------- | --------------------------------------------------------------------- |
| POST   | `creat_system_identity` | Create or replace the authenticated organization's identity (upsert). |
| POST   | `fetch_system_identity` | Read the authenticated organization's identity.                       |

Both use the project's authenticated JSON request format:

```http
Authorization: Bearer <organization-user-token>
Accept: application/json
Content-Type: application/json
Accept-Language: en
```

Determine the organization from the authenticated user, including organization employees. Do not accept an organization ID or project ID from the request body. The identity belongs to the organization, not a selected project, individual employee, browser, or language. All authorized organization members must be able to fetch it on entry. Restrict writes using the existing organization settings/admin authorization policy; sidebar visibility is not authorization.

## `POST creat_system_identity`

````json
{
  "name": "Example organization",
  "logo": "",
  "primaryColor": "#246bfe",
  "secondaryColor": "#0e2a4d",
  "accentColor": "#11a5c5",
  "extractedColors": [],
  "isActive": true,
  "appearance": {
    "sidebarMode": "compact",
    "typography": {
      "fontFamily": "Cairo",
      "fontSize": null,
      "headingSize": null,
      "fontColor": "",
      "headingColor": ""
    },
    "colors": { "headerBackground": "#ffffff" },
    "headerOrder": ["brand", "project", "actions"],
    "headerActionOrder": ["language", "notifications", "profile"],
    "breadcrumbPosition": "left",
    "sidebarCustomGroups": [{ "key": "custom:safety", "label": "Safety workspace" }],
    "sidebarOrder": [
      "overview",
      "operations",
      "company",
      "reports",
      "organization",
      "locations",
      "lockups",
      "documentation",
      "support",
      "custom:safety"
    ],
    "sidebarItemOrder": {
      "custom:safety": ["operations/Inspection"]
    },
    "sidebarItemParents": {
      "operations/Inspection": "custom:safety"
    },
    "sidebarLabels": {
      "group:reports": "Safety reports",
      "operations/Inspection": "Site inspections"
    }
  }
}
``
### Successful save response

HTTP `201` for first creation or `200` for replacement:

```json
{
  "status": true,
  "message": "System identity saved successfully.",
  "data": {
    "identity": {
      "name": "Example organization",
      "logo": "",
      "primaryColor": "#246bfe",
      "secondaryColor": "#0e2a4d",
      "accentColor": "#11a5c5",
      "extractedColors": [],
      "isActive": true,
      "appearance": {
        "sidebarMode": "compact",
        "typography": {
          "fontFamily": "Cairo",
          "fontSize": null,
          "headingSize": null,
          "fontColor": "",
          "headingColor": ""
        },
        "colors": { "headerBackground": "#ffffff" },
        "headerOrder": ["brand", "project", "actions"],
        "headerActionOrder": ["language", "notifications", "profile"],
        "breadcrumbPosition": "left",
        "sidebarCustomGroups": [{ "key": "custom:safety", "label": "Safety workspace" }],
        "sidebarOrder": [
          "overview",
          "operations",
          "company",
          "reports",
          "organization",
          "locations",
          "lockups",
          "documentation",
          "support",
          "custom:safety"
        ],
        "sidebarItemOrder": { "custom:safety": ["operations/Inspection"] },
        "sidebarItemParents": { "operations/Inspection": "custom:safety" },
        "sidebarLabels": {
          "group:reports": "Safety reports",
          "operations/Inspection": "Site inspections"
        }
      }
    },
    "updated_at": "2026-10-27T12:00:00Z"
  }
}
````

The response above corresponds to the compact request. For the complete example file, return that **complete object** in `data.identity`, including every `sidebarItemOrder` entry. `updated_at` is a UTC ISO-8601 timestamp, or `null` when no identity exists.

## `POST fetch_system_identity`

Request body:

```json
{}
```

Example request:

```sh
curl --request POST \
  'https://api.hse.techlabeg.com/organization/fetch_system_identity' \
  --header 'Authorization: Bearer <organization-user-token>' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{}'
```

When configured, return HTTP `200` with the same `data.identity` resource shown in the save response and a suitable message. The frontend also accepts the deployed response format `data: [{ ...identityFields, updated_at }]` and a flat identity object in `data`, including on save. A list must contain exactly one organization identity; an empty list applies defaults. Pagination, incomplete fields, and string data are invalid.

When **no identity has been configured**, return HTTP `200`:

```json
{
  "status": true,
  "message": "No system identity configured.",
  "data": {
    "identity": null,
    "updated_at": null
  }
}
```

The frontend then applies HSE defaults. `data: []` is also accepted as an empty result. `data: null`, HTTP `204`, or HTTP `404` are not the empty-success contract. A missing route or failed request is treated as a load failure and retains the matching browser cache rather than pretending a configuration was fetched.

## Fields and validation

The create request contains all eight root fields. Preserve the nested structure below.

| Field                                             | Type / rule                                                                                                                                                                |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                                            | Required nonempty string; frontend trims whitespace.                                                                                                                       |
| `logo`                                            | String: `""` clears the logo; otherwise an image data URL from FileReader. Uploaded source file maximum is 3.5 MiB. Preserve the data URL for round-trip compatibility.    |
| `primaryColor`, `secondaryColor`, `accentColor`   | Required six-digit hexadecimal color, `#RRGGBB`.                                                                                                                           |
| `extractedColors`                                 | Array of six-digit hex colors; may be empty. Logo extraction currently generates up to six.                                                                                |
| `isActive`                                        | Boolean; preserve `false`.                                                                                                                                                 |
| `appearance`                                      | JSON object with all fields below.                                                                                                                                         |
| `appearance.sidebarMode`                          | `"compact"` or `"expanded"`.                                                                                                                                               |
| `appearance.typography.fontFamily`                | `""` for default, or a font family name. Current frontend allows ASCII names starting with a letter, up to 80 characters, containing letters, numbers, spaces and hyphens. |
| `appearance.typography.fontSize`                  | Integer 12–24, or `null` for default.                                                                                                                                      |
| `appearance.typography.headingSize`               | Integer 18–48, or `null` for default.                                                                                                                                      |
| `appearance.typography.fontColor`, `headingColor` | `""` for default or six-digit hex color.                                                                                                                                   |
| `appearance.colors`                               | Map of per-component color overrides; empty object means use defaults. Values are six-digit hex colors. Supported keys listed below.                                       |
| `appearance.headerOrder`                          | Ordered permutation of `brand`, `project`, `actions`.                                                                                                                      |
| `appearance.headerActionOrder`                    | Ordered permutation of `language`, `notifications`, `profile`.                                                                                                             |
| `appearance.breadcrumbPosition`                   | `"left"`, `"center"` or `"right"`.                                                                                                                                         |
| `appearance.sidebarCustomGroups`                  | Array of `{key, label}`. Unique key matches `^custom:[a-zA-Z0-9-]+$`; nonempty label, maximum 120 characters.                                                              |
| `appearance.sidebarOrder`                         | Ordered group keys, with `overview` always first. Includes the default groups and custom group keys.                                                                       |
| `appearance.sidebarItemOrder`                     | Object: container key → ordered array of item keys. Includes top-level groups, submenu containers and custom groups.                                                       |
| `appearance.sidebarItemParents`                   | Object: stable item ID → destination group/submenu key. Empty object restores original parents.                                                                            |
| `appearance.sidebarLabels`                        | Object: group/item key → nonempty display label, maximum 120 characters. Empty object restores default labels.                                                             |

Supported `appearance.colors` keys:

```text
sidebarBackground, sidebarText, sidebarActiveBackground, sidebarActiveText,
headerBackground, headerText, systemBackground, sectionBackground, sectionText,
tagBackground, tagText, inputBackground, inputText, inputBorder,
primaryButtonBackground, primaryButtonText, secondaryButtonBackground,
secondaryButtonText, breadcrumbBackground, breadcrumbText
```

Omitted color overrides use defaults; do not fill them with explicit fallback colors on the backend. Preserve empty typography strings and `null` sizes as default/inheritance choices.

Logo base64 adds approximately one-third to the file size. Allow at least **8 MiB of JSON request body** at the proxy, web server and application layers, and a suitable JSON/text column capacity. A 3.5 MiB source image can become about 4.67 MiB before adding the remaining settings. Use JSON for these endpoints; multipart serialization can lose nested values and clear operations.

### Sidebar identifiers

The frontend defines identifiers in `src/shared/LayoutComponents/organizationNavigation.ts` and normalizes them in `src/features/SystemIdentity/sidebarLayout.ts`:

- Default groups: `overview`, `operations`, `company`, `reports`, `organization`, `locations`, `lockups`, `documentation`, `support`.
- Stable item IDs use their **original** parent and route name, e.g. `operations/Inspection`. A submenu child uses `group/menu-name/child-name`. Renaming or moving never changes this ID.
- A group label uses `group:<group-key>` in `sidebarLabels`; an item label uses its stable ID.
- Within an original parent, `sidebarItemOrder` uses the original route name (e.g. `Inspection`). When moved elsewhere, it uses the stable ID (e.g. `operations/Inspection`). Submenu IDs can themselves be container keys.
- `sidebarItemParents` stores only changed parents. It permits moving items into custom groups and submenus, and moving submenu children. Whole menus move between top-level groups; recursive nesting/cycles and moving items into Overview are rejected by frontend normalization. Overview remains first and its items cannot move out.
- These maps describe presentation. Actual route permissions still apply even if a route is moved or renamed. Store the maps without maintaining a separate backend route catalog that could discard newly added frontend destinations.

## Errors

Use the existing envelope and meaningful HTTP status codes:

```json
{
  "status": false,
  "message": "Validation failed.",
  "errors": {
    "name": ["Identity name is required."],
    "appearance.typography.fontSize": ["Font size must be between 12 and 24."]
  }
}
```

| HTTP    | Meaning                                               |
| ------- | ----------------------------------------------------- |
| 401     | Authentication missing/expired.                       |
| 403     | User cannot read/update this organization's settings. |
| 413     | JSON payload exceeds the agreed request limit.        |
| 422     | Invalid field values; no identity is changed.         |
| 500/503 | Server failure; no success response or partial write. |

Use native booleans, objects, arrays, numbers and `null` in both directions. Never convert `false` to a missing field, `null` to `0`, or empty arrays/maps to strings. Do not mutate stored settings on fetch.

## Suggested persistence

A `system_identities` table can have `id`, unique organization foreign key `organization_id`, `identity` JSON, `created_at`, and `updated_at`. Cast `identity` to an object/array when serializing. Inside an upsert transaction, resolve the organization from the authenticated context, validate the request, replace its JSON, and return the stored resource. No frontend-generated record ID is required.

When API storage is enabled, the server is the shared source of truth. The frontend:

1. On authenticated organization entry, applies the matching cache immediately, fetches the shared identity once, then applies/caches the response. Normal page navigation does not refetch; re-entry, reload, a changed authenticated organization/session or Retry does.
2. Blocks initial editor interaction until loading finishes. With a fetch error it shows the matching cache or HSE defaults and a Retry action.
3. Sends the complete draft on Save and applies only the returned successful identity. Failed saves leave the draft and last applied identity intact.
4. Saves defaults on Reset using `creat_system_identity`; this reset survives reload and other browsers.
5. Maintains the original `hse-system-identity` key as the active JSON mirror plus `hse-system-identity-owner` and organization-scoped cache keys (`hse-system-identity:organization:<id>`). If login has no organization ID, cache isolation falls back to `hse-system-identity:user:<id>`. The first authenticated organization claims a legacy unowned cache once. Cache metadata is never sent to the API.
6. Clears the applied organization theme when leaving the organization/logging out and ignores delayed responses belonging to a previous organization/session. A full or unavailable browser cache does not undo a successful server save.

## Frontend files

```text
src/features/SystemIdentity/
  Core/params/CreateSystemIdentityParams.ts
  Core/params/FetchSystemIdentityParams.ts
  Data/apiServices/CreateSystemIdentityApiService.ts
  Data/apiServices/FetchSystemIdentityApiService.ts
  Data/models/SystemIdentityModel.ts
  Domain/repositories/CreateSystemIdentityRepo.ts
  Domain/repositories/FetchSystemIdentityRepo.ts
  Domain/useCase/CreateSystemIdentityUseCase.ts
  Domain/useCase/FetchSystemIdentityUseCase.ts
  Presentation/controllers/CreateSystemIdentityController.ts
  Presentation/controllers/FetchSystemIdentityController.ts
```

`ApiNames` contains both endpoint names. `useSystemIdentity.ts` coordinates cache/application and session changes; `App.vue` loads on organization entry; the existing editor calls Save and Reset. All API calls use the project's service → repository → use case → controller layers. Browser contract tests in `scripts/system-identity-api.spec.mjs` intercept requests and do not write to production.

## Home chart and layout preferences

The editor's **Home charts and layout** tab saves preferences under `appearance.dashboard` in the same identity request. The backend must persist and return this nested object unchanged. Missing dashboard preferences in older identities use the original Home layout and charts.

```json
{
  "dashboard": {
    "panels": [
      { "id": "safety", "visible": true, "width": "default" },
      { "id": "inspection", "visible": true, "width": "half" },
      { "id": "equipment", "visible": true, "width": "full" },
      { "id": "corrective", "visible": true, "width": "default" },
      { "id": "workforce", "visible": true, "width": "default" },
      { "id": "projects", "visible": true, "width": "default" },
      { "id": "actions", "visible": true, "width": "default" }
    ],
    "charts": {
      "equipment": {
        "type": "doughnut",
        "palette": "brand",
        "legend": true,
        "grid": true,
        "height": 300
      }
    }
  }
}
```

- Array order determines panel order, including the reading/tab order on Home. Visibility and widths do not grant access to data. Existing dashboard permissions still apply.
- Panel IDs: `safety`, `inspection`, `equipment`, `corrective`, `workforce`, `projects`, `actions`.
- Chart IDs: `safety`, `inspection`, `equipment`, `equipmentLocations`, `workforce`, `cases`. Unspecified chart IDs get default settings.
- Chart types: `default`, `bar`, `horizontalBar`, `stackedBar`, `line`, `area`, `pie`, `doughnut`, `polarArea`, `radar`, `roundedBar`, `horizontalStackedBar`, `straightLine`, `steppedLine`, `dashedLine`, `points`, `stackedArea`, `radarOutline`, `semiDoughnut`, `mixed`.
- Palettes: `safety`, `brand`, `ocean`, `custom`. Each chart also accepts `customColors`, an array of up to 12 six-digit hex colors (default `[]`). With the custom palette, colors apply to series for grouped charts and to categories for circular and single-series charts; additional categories repeat the color list. Custom colors are saved per chart, including when a preset palette is temporarily selected. Height is constrained to 200–600 pixels. `legend` and `grid` are booleans. Default chart settings are `default`, `safety`, `true`, `true`, `300`.
- Charts use real API counts and retain missing values as unknown. Grouped circular charts use one dataset per location and one colored slice per series, preserving separate counts. Safety charts show incidents (`accidents`) and observations (`hazard + observation`); incomplete observation totals remain unknown. Each customized chart includes an accessible data table.
- Disabling the identity uses default dashboard settings. Reset dashboard edits only the dashboard draft; Save and apply identity persists it. Full identity reset also resets dashboard preferences.
