# Feature documentation

The organization sidebar exposes Documentation → All guides / Project.
The catalog is `/organization/documentation`; guides use `/organization/documentation/:feature`.

To add another feature:

1. Add a bilingual `FeatureGuide` entry to `guides.ts` with a unique slug, navigation translation key, steps, prerequisites, overview guidance, and FAQs.
2. Add that navigation key to `src/locales/en.json` and `src/locales/ar.json`.
3. Put the real walkthrough GIF and a static WebP poster in `public/documentation/<feature>/` and reference them in the guide.

The catalog, guide route, contents navigation, and sidebar links are generated from this registry. Existing saved sidebar layouts receive new destinations through the normal identity layout migration.

Animation starts only when the reader selects Play and stops by restoring the poster. This avoids automatic motion and loading the GIF before it is requested.

## Project recording

Recorded from the live project wizard on 2026-10-26 using the supplied test company account. The demonstration project is ID 11, titled “Project Setup Guide Demo” / “مشروع توضيحي لدليل الإعداد”. All five save endpoints succeeded; setup readiness reached 100%. The project includes one location, zone, position, employee, team, and equipment assignment, plus Friday/Saturday holidays.

The GIF contains actual browser screenshots from Projects → Basic data → Holidays → Positions → Teams → Equipment → Projects → Project summary. Repeated idle frames were shortened; the login screen and credentials are excluded. The poster shows the completed project summary. The recording creates no additional records when viewed.

Verify with `PROJECT_TEST_URL=http://127.0.0.1:5180 npx playwright test scripts/documentation.spec.mjs`. Browser verification intercepts remote API requests with local fixtures and does not modify production.
