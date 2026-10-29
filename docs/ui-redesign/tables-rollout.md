# Shared table design rollout

The user approved extending the Inductions design across the system. This supersedes the earlier experiment's restriction to one page.

## Coverage

- **208 native table declarations in 204 Vue components** use the shared table identity.
- **90 standard listing components** use the reusable continuous register surface and translated route title.
- Organization, admin/settings, website administration, employee, dashboard data tables, dialogs, import previews, report screens and matrices are included in the source inventory.
- Existing card views remain card views. Every existing table remains a table.
- PrimeVue DataTable selectors share the same theme; the current native-table inventory is exhaustively annotated.

[Full component inventory](tables-rollout/inventory.json).

## Design and architecture

The shared design carries forward the approved Inductions surface, restrained header, readable table typography, cool-gray borders, aligned cells and compact pagination. Native tables scroll horizontally inside their own container on small screens. The previous mobile record-card conversion was removed at its source, rather than hidden by another layer of fragile overrides.

`RegisterPage.vue` provides the common register shell and route-derived translated heading. Existing search, filters, add/import/export controls and permission gates stay in their original Vue templates. Complex pages that already have a composed header retain that header and adopt the table styling.

`tableIdentity.ts` supplies a globally registered directive. It derives the scroll width from actual header column spans, including dynamic matrices, and adds an accessible scroll-region label. It never reparents Vue-owned DOM nodes, replaces records, or infers pagination from loaded row counts. Numeric index and action columns receive compact widths when their actual markup identifies them.

The shared stylesheet handles native and PrimeVue tables, row separation, readable headers, sticky final action cells, focus indicators and pagination. Existing matrix status colors, input controls, merged cells, selections and actions remain. Screen-only styling leaves report print renderers in place. Tables hidden through `v-show` remain hidden: display rules deliberately avoid `!important`.

The shared row action trigger is now a real `type="button"` control with an accessible name, expanded state and keyboard behavior. Existing menu entries, callbacks, routing, delete confirmations and permission filtering are preserved. Loading tables use skeleton headers instead of repeated `#` labels. Pagination retains its callbacks and API behavior, with null-safe page-count guards.

System Identity primary-color customization is respected through the existing identity token. Surfaces and text use the existing light/dark HSE tokens; fonts remain inherited from the application identity.

## Preservation checks

The source audit compares transpiled feature scripts against the pre-rollout snapshot. **All 204 table-bearing component scripts match**, apart from the new presentation-component import. API services, controllers, models, filters, permissions, search handlers and business logic were not rewritten.

All migrated templates compile. One existing table/empty-state conditional required the new scroll wrapper to carry its original `v-if`, preserving adjacency with the original `v-else` branch.

The rollout does not create, update or delete production records. Browser checks use the authenticated organization's real API responses. No mock records were introduced.

## Verification

- Production Vite build passed; the existing large-chunk advisory remains.
- Targeted ESLint and Prettier checks passed for the new shared components/helpers and modified shared controls.
- `git diff --check` passed.
- The template/source audit covered all 208 tables and verified all 204 feature scripts.
- Chrome DevTools MCP captured eight actual organization routes at **1440, 1024, 768 and 390px**, producing 32 page/viewport checks.
- Every visible body cell in those checks remained `table-cell`; headers remained `table-header-group`, and rows remained `table-row`.
- No sampled page had document-level horizontal overflow. Wide tables scrolled inside their containers.
- The isolated browser run recorded no uncaught page errors. Existing notification/socket and translation console warnings are separate from this result.

The sampled routes were Roles, Employees, Shifts, Visit Categories, Internal Audit Register, Employee Certificate Matrix, PPE Settings and Inductions. This is representative browser coverage, not a claim that every permission variant and every route was manually opened.

[Browser measurements](tables-rollout/browser-qa.json) · [Interaction checks](tables-rollout/functional-qa.json)

| Screen             | Desktop                                               | Mobile                                              |
| ------------------ | ----------------------------------------------------- | --------------------------------------------------- |
| Roles              | [1440px](tables-rollout/roles-1440.png)               | [390px](tables-rollout/roles-390.png)               |
| Employees          | [1440px](tables-rollout/employees-1440.png)           | [390px](tables-rollout/employees-390.png)           |
| Audits             | [1440px](tables-rollout/audits-1440.png)              | [390px](tables-rollout/audits-390.png)              |
| Certificate matrix | [1440px](tables-rollout/certificates-matrix-1440.png) | [390px](tables-rollout/certificates-matrix-390.png) |
| PPE Settings       | [1440px](tables-rollout/ppe-settings-1440.png)        | [390px](tables-rollout/ppe-settings-390.png)        |
| Inductions         | [1440px](tables-rollout/inductions-1440.png)          | [390px](tables-rollout/inductions-390.png)          |

The same screenshot directory contains the 1024px and 768px captures, plus Shifts and Visit Categories.

## Limits and existing issues

The full repository TypeScript check remains failing on existing modules, including unresolved legacy component import aliases and unrelated model/type errors. It is not reported as a clean gate. The new shared table code was checked separately by lint, template compilation and the production build.

The earlier experiment documented existing API search limitations, notification setup failures and an Arabic mobile shell/capture issue. This rollout does not claim to fix those unrelated behaviors. It uses logical CSS properties and localized labels, but does not claim exhaustive RTL, screen-reader, physical-device, admin-role or print/PDF interaction testing.

Some specialized matrix controls require taller rows than the default table density. Their semantic state colors and functionality take priority over forcing every row to the same height.

The temporary filesystem filled during QA. Task-owned baseline files and subsequent temporary artifacts were moved to the workspace disk. Unrelated user files were not removed. Concurrent edits to `BreadCrumb.vue` were left untouched and are excluded from the rollback patch.

## Reuse and rollback

New tables should use `v-table-identity`, the `hse-data-table` class and a `hse-table-scroll` container. Standard listing pages can use `RegisterPage` without changing their controllers. `node scripts/tables/audit.mjs` checks source coverage and compilation; when a baseline is available, `HSE_TABLE_BASELINE` enables the additional feature-script preservation comparison.

The original Inductions experiment snapshots remain available. A separate [rollout patch](tables-rollout/rollout.patch) preserves the system-wide change relative to the approved Inductions baseline. It excludes unrelated user work.

To check whether a rollback is still applicable:

```sh
git apply --reverse --check docs/ui-redesign/tables-rollout/rollout.patch
```

To restore the pre-rollout source after reviewing any later edits:

```sh
git apply --reverse docs/ui-redesign/tables-rollout/rollout.patch
```

No commit, remote push or production deployment was performed.
