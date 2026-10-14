# HSE.Cloud.AI reusable UI identity skill

Install into a Codex project:

```bash
mkdir -p .agents/skills
cp -R hse-cloud-identity .agents/skills/
```

Or install globally for Codex:

```bash
mkdir -p ~/.agents/skills
cp -R hse-cloud-identity ~/.agents/skills/
```

From the project root, invoke with:

`Use $hse-cloud-identity to redesign /organization/project-details/481. Preserve all functionality and restrict changes to that page.`

For another page:

`Use $hse-cloud-identity on src/features/Organization/Equipment/. Create a modern page layout consistent with the HSE identity. Keep API calls and shared shell unchanged.`

The developer should have the actual reference HTML accessible at:
`/home/techlab/Downloads/HSE_Projects_Studio_05_1_FIXED_EN.html`

When it is missing, the skill explicitly works from the screenshot and provisional tokens without falsely promising an exact pixel match.

## Pass a component directly

```text
Use $hse-cloud-identity
Target: src/features/Organization/Project/components/MyComponent.vue
Restyle this component only. Preserve all props/events and real behavior.
Create the necessary component-local CSS and shared feature tokens only if missing.
Implement the files and verify responsive states.
```

Use a component name instead of a path if Codex can resolve it uniquely in the repository. See `references/component-migration.md` for patterns and new-component creation examples.
