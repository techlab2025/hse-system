# Dashboard visual QA

These images show the **local production build with explicit test fixtures**, including a demonstration organization name and completed setup. They are not live customer analytics. No credentials are embedded.

The supplied visual reference is `design-references/HSE Safety Dashboard Overview.png`. The implementation follows its composition with data-driven adaptations: Chart.js grouped location columns at every dataset size (responsive pagination for larger sets) instead of fabricated history, independent inspection/certificate counts instead of invalid donuts, and an open-action counter instead of an unsupported completion percentage.

Reproduce after starting a local production preview:

```sh
DASHBOARD_TEST_URL=http://127.0.0.1:5185 node scripts/dashboard/capture-dashboard.mjs
```

English/LTR and Arabic/RTL screenshots at 375, 768, 1024, 1440, 1536 and 1920px are included (12 captures). Captures disable transient animations. The browser suite separately checks widths 320, 375, 768, 1024, 1440 and 1920 pixels.

## Focused grouped safety chart

Run `node scripts/dashboard/capture-safety-chart.mjs` against the local production preview. It exports `safety-chart-one-location.png`, `safety-chart-multiple-locations.png`, `safety-chart-many-locations-rtl.png`, `safety-chart-mobile-rtl.png` and `safety-chart-tooltip.png`. All use explicitly isolated fixtures and absent root-cause data to verify that the chart card has no reserved empty subsection. The many-location image shows actual pagination over the provided categorical records, not synthetic history.
