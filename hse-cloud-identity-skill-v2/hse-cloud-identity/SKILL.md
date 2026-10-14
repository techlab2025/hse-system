---
name: hse-cloud-identity
description: Apply the HSE.Cloud.AI Projects Studio enterprise visual identity to any user-specified Vue 3 page, feature, or component. Use when asked to redesign, restyle, modernize, harmonize, or migrate UI to the HSE identity while preserving behavior, API, fields, and app shell.
---

# HSE.Cloud.AI Identity — page migration skill

## Outcome
Update the **actual target page/components** to the HSE.Cloud.AI enterprise visual identity, not merely describe a design. Preserve existing features and real data. This is a **design system**, not a single screenshot layout: faithfully reproduce visual *language* while designing an appropriate information architecture for the target page.

## Inputs to establish before edits
1. **Target**: user-supplied route, component, directory, or named page. If none is identifiable, ask which page to style.
2. **Repository**: inspect repo instructions (`AGENTS.md`), existing packages, routing, CSS framework, PrimeVue version, locales, and tests.
3. **Canonical reference**: inspect `/home/techlab/Downloads/HSE_Projects_Studio_05_1_FIXED_EN.html` **if it exists** or a more recent HTML reference provided by the user. Extract design values from the real CSS and computed styles (including linked font files) before editing. If inaccessible, use `references/project-setup-reference.png` plus `references/identity-guide.md` and `assets/hse-identity-tokens.css` as a **provisional** visual baseline. Tell the user any exact values that could not be confirmed; do not pretend the HTML was inspected.
4. **Scope**: identify boundaries and existing approved pages. Do not touch unrelated pages or global layout by default.

## Non-negotiable workflow
1. **Protect Git work**: run `git status --short` and `git branch --show-current`; respect any branch instruction from the user/repo. Never reset, clean, force checkout, auto-stash, merge, or push. Stop if a required branch switch threatens uncommitted work.
2. **Audit target**: inspect rendered structure and actual Vue source, fields, validation, API, stores, permissions, events, tabs, dialogs, forms, responsive behavior, locale direction. Inventory components, including teleported overlays.
3. **Extract identity**: read source HTML and styles if available; capture font family/weights, hues, surfaces, shadows, radii, spacing, inputs, tables, buttons, states, and layout. Resolve discrepancies using this precedence: (a) user's latest explicit visual requests, (b) latest supplied reference HTML, (c) user's approved styled pages, (d) bundled screenshot and provisional tokens. Document differences when references conflict.
4. **Implement**: create a page/feature root class (e.g. `.hse-identity`) with scoped variables and semantic component classes. Reuse existing components/PrimeVue APIs. Reorganize markup **only if required** for modern hierarchy, without removing business fields or actions.
5. **Visual QA**: view the rendered page in an authorized browser. Compare with the reference at **matching viewport/zoom** wherever possible. Check 1440px desktop, 768px tablet and 390px mobile at minimum; more sizes when practical. Fix CSS specificity, font loading and overlay styles from computed styles. Don't claim pixel-perfect without actual comparison.
6. **Regression QA**: run existing lint/typecheck/build/tests where available, exercise real interactions, confirm unrelated pages have no styling changes, and review `git diff` and branch. Report what was and was not verified.

## Identity rules
- **Aesthetic**: premium but restrained B2B safety/operations SaaS; clean navy/blue hierarchy, light mist background, crisp white surfaces, controlled borders, subtle shadows, compact metadata, excellent scanability.
- **Tokens**: use `assets/hse-identity-tokens.css` as a *starting point*, not as verified original HTML values. Replace values with exact extracted reference values when available. Do **not** replace approved shared tokens in a way that alters other pages.
- **Typography**: match reference's actual font if confirmed. Otherwise use a local, available UI sans fallback stack; never assert Inter is definitely the reference font. Set intentional heading, section, body, label, helper, and metric sizes. Avoid font-size drift, default browser fonts, and unclear contrast. Support Arabic with appropriate fonts/fallbacks if present.
- **Color**: dark navy for headings/navigation, strong bright-blue CTAs and selected state, quieter blue-gray secondary text, white surfaces, soft blue-gray separators, semantic green/amber/red for actual statuses. Do not use random gradients or arbitrary new palette colors.
- **Cards**: white, delicate border, rounded corners, natural vertical rhythm, subtle non-glossy elevation; highlighted cards only when meaning warrants it.
- **Controls**: coherent field labels and helper text; matching input/select/date/textarea height, radius, border, focus ring, error, disabled, loading, hover and overlays. Keep PrimeVue functionality and accessibility.
- **Actions**: strong primary blue, outlined/subtle secondary, clearly distinguish destructive; icons sized and aligned uniformly. No dead controls.
- **Data presentation**: cards, metrics, tables, badges, detail rows, timelines, charts as appropriate **only with real data**; do not invent counts, project scores, dates, or labels.
- **Layout**: adaptable grid; page heading with eyebrow + title + concise subtitle/metadata; sections with restrained accent dividers; no giant whitespace or gratuitous KPI dashboards. Reuse same tokens across all redesigned pages without forcing them into identical layouts.
- **Interaction**: keyboard focus visible, reduced-motion consideration, correct overlay stacking, reachable actions, readable narrow-screen layout, no overflow, RTL/LTR logical positioning.

## Suggested class model
`.hse-identity` root; `.hse-id-page`, `.hse-id-page-header`, `.hse-id-eyebrow`, `.hse-id-title`, `.hse-id-subtitle`, `.hse-id-section`, `.hse-id-section-heading`, `.hse-id-card`, `.hse-id-card__head`, `.hse-id-card__body`, `.hse-id-kpi`, `.hse-id-badge`, `.hse-id-button`, `.hse-id-button--primary`, `.hse-id-field`, `.hse-id-label`, `.hse-id-control`, `.hse-id-table`, `.hse-id-tabs`.

In existing apps, adapt names to established code conventions and avoid large renames. PrimeVue overlay panels portaled outside root require *dedicated unique* panel classes/PT; don't rely on root descendant selectors in that case. Don't globally override `:root`, `body`, `button`, `input`, `.p-button`, `.p-inputtext`, etc.

## Choosing the right extent of redesign
- **Explicit target page only**: modify only that route and its genuinely target-specific components/styles. The user's current project listing or wizard must remain unchanged unless expressly targeted.
- **Multiple target pages**: unify tokens/components while giving each page its own purposeful layout.
- **No exact reference layout**: invent a compelling modern arrangement from *existing available content* while copying the established visual identity, not inventing UI functionality.
- **Cross-feature/global rollout**: only when the user clearly asks. Otherwise document shared shell dependencies without editing them.

## Done criteria
- Visual identity applied to every relevant state of the target, not just first visible viewport.
- Typography, colors, radii, shadows, spacing, cards, buttons, form controls, tables, badges, dialogs, menus, hover/focus/error/loading states are consistent.
- Data bindings, translations, navigation, validation, permissions, CRUD and API shape unchanged.
- Accessible, responsive, English/Arabic directions handled if supported.
- Approved unrelated pages visually unchanged; no unintended global style leakage.
- Real screenshots and test results reported honestly.

## Final delivery
Briefly state target routes, files changed, exact verified design tokens versus provisional tokens, UI changes, screenshot comparison results and viewport sizes, tests run with pass/fail, scope isolation, and remaining mismatches. Do not answer with a plan alone when editing tools/repo are available.

## Supporting files
- `references/identity-guide.md` — component-by-component application guide, token provenance and visual checklists.
- `references/project-setup-reference.png` — visual reference screenshot from user (not a source for exact CSS values).
- `assets/hse-identity-tokens.css` — feature-scoped provisional CSS token baseline to customize/extract, NOT guaranteed exact HTML CSS.

## Direct component mode (primary invocation)
When the user passes a `.vue` file path, component name, pasted Vue source, or an explicit list of components, treat that as **the entire target**; do not request a route or redesign the surrounding page. Examples:

- `Use $hse-cloud-identity on src/features/Organization/Project/components/ProjectCard.vue`
- `Use $hse-cloud-identity on ProjectSummary.vue and ProjectDetails.vue; create missing local style files`
- `Use $hse-cloud-identity on this Vue SFC: <paste code>`

### Input resolution
1. For a path, read that file, its existing imports and styles, and the small set of directly involved child components. For a name, search the repo for the matching SFC and disambiguate only if multiple plausible targets exist. For pasted code, operate on the pasted code; if repository access is available and the destination is clear, write it there, otherwise return complete updated SFC and any auxiliary files as text.
2. Detect whether the component is shared by unrelated pages. In that case either scope the new appearance behind an explicit opt-in prop/class set **at the usage site**, or ask if modifying all usages is intended; do not inadvertently restyle global instances.
3. Never change props, emits, slots, `v-model` contracts, API calls, validation, or i18n keys. Do not remove controls or data to imitate a screenshot. Only restructure markup if behavior is preserved.
4. Set a recognizable opt-in root class such as `.hse-identity.hse-id-component--project-summary`, but reuse existing root when practical. When the SFC has multiple roots, wrap carefully without disrupting fallthrough attributes or event behavior.
5. Refactor current CSS instead of stacking conflicting overrides. Avoid selector leakage; maintain local PrimeVue panel classes for teleported overlays.

### File creation behavior — required
**Create the actual files in the repository whenever writable repository tools are available; do not stop with suggestions.** Choose the smallest set needed:
- Update `<Target>.vue` in place (or create only if the user explicitly requested a new component).
- If current conventions support a standalone stylesheet, create `<Target>.identity.css` beside the SFC or an equivalent feature-local `styles/<feature>-identity.css` and import it from the target. If it already exists, update rather than duplicate.
- Create feature-scoped `styles/hse-identity-tokens.css` **only if the feature has no suitable established token source**. Copy/adapt `assets/hse-identity-tokens.css`; do NOT create a redundant token file for every component. Load it exactly once at the feature boundary or in a component if that is the only target, and verify CSS actually loads.
- Create other new files (reusable subcomponent, test) **only when justified** by real complexity or established repo conventions. Never add empty placeholders, fake fixture data, or unused files.
- Do not write generated files into the Codex skill installation directory while styling an application. The skill is documentation/templates; the application's files belong under `src`.
- If the user asks to **generate a new component** in this identity, create the requested SFC and necessary local styling, use the existing project architecture, and provide working props/emits/events where specified. If behavior requirements are missing, implement presentational-only behavior explicitly without pretending API integration exists.

### Component execution steps
1. State resolved component(s), file dependencies, and scope in 2–4 lines.
2. Inspect SFC script/template/style, target usages, and design reference. Check existing token files to avoid duplicates.
3. Implement actual edits/new files. Cover all component states: default, hover, focus-visible, selected, disabled, loading, error, empty, expanded, small-screen, and RTL if applicable.
4. Run available project commands and render the component/owning route where possible; compare before/after visually. Confirm no style changes outside intended usage.
5. Report updated/created file paths, exact vs provisional tokens, checks performed, and any unverified points. Never claim files were created unless physically written.

### Component-specific identity recipe
Use `references/component-migration.md` for a concrete design checklist, safe PrimeVue scoping, file layout patterns, and concise invocation templates.
