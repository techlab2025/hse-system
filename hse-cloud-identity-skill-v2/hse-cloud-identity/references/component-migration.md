# HSE identity — component migration playbook

## Expected user input
- Existing Vue SFC path, Vue component name, one or more paths, or pasted component source.
- Optional constraints: preserve DOM structure, restyle only, create separate CSS, component's owning route, or opt-in-only styling.
- Latest user directions override default design assumptions.

## Scoped styling pattern

**Example `ProjectCard.vue`** (illustrative selectors, adapt to actual markup):

```vue
<template>
  <article class="hse-identity hse-id-project-card">
    <header class="hse-id-project-card__header"><slot name="header" /></header>
    <div class="hse-id-project-card__body"><slot /></div>
  </article>
</template>
<style src="./ProjectCard.identity.css"></style>
```

**Example `ProjectCard.identity.css`** — actual values should reference available extracted tokens:

```css
.hse-id-project-card {
  background: var(--hse-id-surface, #fff);
  color: var(--hse-id-text, #10233f);
  border: 1px solid var(--hse-id-border, #dfe7f1);
  border-radius: var(--hse-id-radius-card, 16px);
  box-shadow: var(--hse-id-shadow-card, 0 8px 24px rgba(24,54,92,.08));
  overflow: hidden;
}
.hse-id-project-card__header { padding: 20px 24px; border-block-end: 1px solid var(--hse-id-border, #dfe7f1); }
.hse-id-project-card__body { padding: 24px; }
@media (max-width: 640px) {
  .hse-id-project-card__header, .hse-id-project-card__body { padding: 16px; }
}
```

The example is *not* a mandatory component API or exact reproduction of the reference. Preserve the actual component's template bindings, slots, events, and existing semantics. Use `style scoped` instead of external styles when the host project convention requires it. Remember: custom properties declared on `.hse-identity` are available to its descendants and the element itself, but **not to portaled overlays**; add a unique overlay class/PT and supply variables there as necessary.

## Control specification
- **Page**: subtle blue-gray background, matched max width and gutters, purposeful title + subtitle.
- **Typography**: verify font loading and computed family; meaningful 11/12/14/16px labels/body baseline and 24–32px display baseline when exact reference unavailable; no gratuitous tiny text.
- **Cards**: white with thin muted border, 16px radius baseline, subtle shadow; nested cards only if meaning requires.
- **Buttons**: blue primary with accessible text, subdued secondary outline, muted ghost, red destructive; explicit focus ring, disabled/loading states; don't lose handlers.
- **Forms**: ~38px control-height baseline, 10px radius, consistent labels and placeholders, focus/error/disabled states; use existing control widgets, no fake native replacements.
- **Table**: clear headers, restrained separators, hover/selection, actions, pagination/empty state, RTL when relevant.
- **Dialogs/menus/select popups**: keep teleport/panel styling within named opt-in classes; test open and closed.
- **Motion**: 120–220ms understated transitions, with reduced-motion override.
- **Mobile**: readable titles and labels; no overflow; preserve active actions.

## File decision tree
1. Existing local CSS sufficient? **Edit it**, do not create duplicates.
2. No component stylesheet? Prefer SFC `<style scoped>` if consistent with repo; else create adjacent `<Component>.identity.css`.
3. Shared tokens already exist? **Reuse them**; avoid creating another copy.
4. No usable tokens? Create one tokens file **per scoped feature**, import once, keep `.hse-identity` namespace.
5. Referenced images/icons? Reuse approved assets/icons. Don't invent assets or introduce new dependencies.
6. New component requested by the user? Write a real `.vue` component plus necessary CSS and targeted test when feasible.

## Acceptance tests
- Component render at 1440, 768, 390 CSS px (when browser is available).
- All original labels/values, props, emits, slots, directives, events, validation, permissions survive.
- PrimeVue styles actually applied after CSS cascade; opened popovers included.
- No global changes to unrelated components or pages.
- Existing lint/typecheck/build where present; report real outcomes.
- New files show up in `git status --short`; report paths, not assertions without verification.

## User invocation examples

```text
Use $hse-cloud-identity
Target component: src/features/Organization/Project/components/ProjectDetailsCard.vue
Update the existing component to the HSE identity, including all interaction states.
Create/import local CSS and tokens only if missing. Do not change APIs or other pages.
```

```text
Use $hse-cloud-identity
Targets: src/features/Organization/Project/views/ProjectSummary.vue and ProjectDetails.vue
Apply one coherent identity to both, create shared feature-local files where necessary,
preserve their unique information architecture, and verify responsive screenshots.
```

```text
Use $hse-cloud-identity
Create a NEW component at src/features/Organization/Project/components/ProjectStatusCard.vue
Inputs: status, title, subtitle; emit click on selected state.
Use existing icon library and feature-local identity; return final file paths.
```
