# HSE.Cloud.AI Visual Identity — application guide

## Provenance & accuracy
The screenshot in this directory depicts the HTML reference's **Create a new project** page. It supplies visual composition but **does not establish exact computed values**. The token CSS is a *candidate palette and scale* from the earlier user-supplied implementation brief, **not verified by opening the source HTML**. The canonical reference, if available on the developer's machine, is:

`/home/techlab/Downloads/HSE_Projects_Studio_05_1_FIXED_EN.html`

Use that file's actual CSS and browser computed styles to confirm/replace typography, sizes, colors, borders, radius, shadows, spacing and states. Prefer HTML CSS over the provisional values. Never describe approximations as a 100% copy.

## Composition demonstrated by screenshot
- Dark navy application sidebar (global app shell: don't modify unless user explicitly authorizes).
- Light cool-gray content canvas, compact top toolbar/breadcrumb.
- Page eyebrow in vivid blue, strong navy H1, concise muted supporting line and compact right-side action.
- Two-column setup content: narrow "Setup journey" steps/progress rail + larger white form card.
- Form card: fine border, clean header/subtitle, tiny blue uppercase section headers with blue horizontal marker, two-column compact inputs, white fields and light border, footer separated by line and vivid primary button.
- Step rail: blue active step tile, neutral inactive step markers, soft blue information panel, navy completion card.

The reference screenshot is a **layout example**, not a demand to put a step rail on unrelated pages.

## Page pattern
1. On background `--hse-id-bg`, use eyebrow → title → subtitle/metadata → relevant right-aligned actions.
2. Group content into clearly named sections. Use flexible card grids when warranted by information density.
3. Treat metrics as *real project values*; don't create fictional indicators.
4. Use modest white cards, fine borders, subtle elevation, consistent radius and rhythm.
5. Prioritize readable small text for metadata but avoid shrinking every value.
6. For operational pages, make action hierarchy and state badges clearer than pure decoration.
7. For complex forms, preserve real controls/validators and organize in clear sections with the same UI styling.

## Component QA inventory
| Element | Verify |
|---|---|
| Font | actual family loaded, fallback, English/Arabic, weights, size hierarchy, line-height |
| Header | eyebrow, h1, subtitle, breadcrumb, metadata, action alignment |
| Cards | border, radius, white surface, subtle shadow, header/body/footer rhythm |
| Tables | headers, separators, hover, sorting, filters, pagination, empty/error/loading |
| Inputs | text, number, select, multi-select, date, textarea, upload, switches, focus/error/disabled |
| Tabs | selected pill/underline matching context, content navigation, keyboard interaction |
| Buttons | primary blue, secondary outline, ghost/danger, icons, loading, disabled, focus |
| Badges | real semantic status, contrast, shape, consistent padding |
| Overlays | popup position, portal-specific classes, z-index, keyboard/focus, mobile bounds |
| Charts | real data, legend type and contrast, tooltip quality, do not fake series |
| Responsive | 1440, 768, 390 CSS px, plus test 320 where possible |
| Regression | unchanged APIs, events, permissions, locale, unrelated layout |

## Prompt example for Codex
`Use the $hse-cloud-identity skill to redesign /organization/project-summary/481. Keep the real data and behavior; do not change the global sidebar or already-approved Projects listing. Extract the real identity from HSE_Projects_Studio_05_1_FIXED_EN.html if available, then implement, compare screenshots, and test.`
