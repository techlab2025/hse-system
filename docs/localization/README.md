# Arabic / English localization audit

This report accompanies the localization refactor. It records implementation and verification evidence; it does not certify that every production record, browser dialog, or permission combination has been manually approved.

## Architecture

The existing `vue-i18n` installation remains the only translation framework. `src/localization/i18n.ts` owns the singleton locale. `syncLocale.ts` updates `html.lang`, `html.dir`, persisted `lang`, PrimeVue's installed locale schema, and generated editor chrome immediately. The header and login language controls switch without reloading the document.

- `src/locales/en.json` and `ar.json` contain matching, nonempty catalogs. Message compilation, interpolation parity, literal references, and navigation aliases have automated checks.
- `primeVueLocale.ts` derives English from the installed PrimeVue version and supplies Arabic calendar, filter, file upload, pagination, password and accessibility labels. Date input serialization conventions are preserved.
- `direction.css` supplies logical alignment, isolated email/URL/telephone fields, Arabic font fallbacks and explicit directional-icon mirroring. Logos, anatomy illustrations, pictures, search, warning and download icons are not globally mirrored.
- Shared form fields, language inputs, validation, feedback dialogs, select empty states, pagination, editor toolbars and navigation resolve UI text at explicit boundaries. Open validation and feedback can change language.
- `TitleInterface.translationKey` identifies developer-defined enum labels. `localizedTitles` and `localizedRecord` select existing backend bilingual fields reactively. Ordinary names, descriptions, serials and manually edited values are preserved. Stable IDs, route names, permission codes and API field selectors remain unchanged.
- `formatters.ts` handles display formatting. Request date/time serializers and business calculations retain their existing formats.
- `apiMessages.ts` localizes known stable codes and standard HTTP errors, retains meaningful unknown server messages, and replaces recognizable stack traces with a generic error. `messages.ts` is only for system feedback owned by the UI.

The previous body-wide translation `MutationObserver` has been removed. User content must never be translated by a general DOM search/replace.

## Coverage and evidence

The source scanner visits all supported source files under `src`, including admin, organization, employee, website management, nested routes, model adapters, validation and styles. The machine-readable inventory is [source-audit.json](source-audit.json). Findings are candidates, not automatically confirmed defects: examples include schema field names, explicit translation keys, bilingual guide content, proper names, sample spreadsheet data and internal diagnostics.

The browser route inventory is [runtime-route-audit.json](runtime-route-audit.json). It uses the real router registry, local fixture responses and representative required parameter `1`. It is navigation smoke coverage, not a completed create/edit/delete cycle for every feature. Runtime errors, console render errors, opposite-script candidates and direction/overflow measurements are retained for review. User-entered text and technical codes can legitimately appear among opposite-script candidates.

Targeted browser checks exercise live switching, preserving user text, generated editor controls, teleported calendars/tooltips, localized validation with a red invalid-field border, lookup form mounting, authentication screens, and representative admin/organization/employee layouts at mobile and desktop widths. Documentation regression checks verify the existing guides and GIFs. No production records were created by this audit.

See [verification.json](verification.json) for the final recorded check results and remaining failures.

| Final check                                                       | Result                                                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Source inventory                                                  | 6,644 files, including 1,955 Vue components and 4,373 TypeScript files                            |
| Catalogs                                                          | 6,119 keys per language; no detected parity, empty-value, interpolation or referenced-key defects |
| Production build                                                  | Passed; existing large-bundle warning remains                                                     |
| Localization contract / business unit tests                       | 14 / 15 passed                                                                                    |
| Localization / documentation browser tests                        | 18 / 17 passed                                                                                    |
| Identity API and storage / appearance / role access browser tests | 12 / 3 / 4 passed                                                                                 |
| Router sweep                                                      | 1,086 route/language checks, covering 529 distinct path patterns                                  |
| Root language/direction mismatches / desktop overflow             | 0 / 0 detected                                                                                    |
| Route page errors / console render-error checks                   | 40 / 52, affecting 26 distinct path patterns; retained in the report                              |
| Full-project TypeScript                                           | Fails: 3,606 diagnostics; unchanged HEAD baseline has 3,608                                       |

[Runtime issues by route](runtime-issues.json) groups the observed failures. They are not counted as passing routes. The 781 source text candidates and 807 physical style declarations remain a review inventory, including translated metadata, technical values, sample data, intentional geometry and legacy styles. The scanner does not claim that every candidate is an outstanding defect or that none needs further review.

## Terminology

| English           | Arabic           |
| ----------------- | ---------------- |
| Project           | المشروع          |
| Location          | الموقع           |
| Zone              | منطقة العمل      |
| Equipment         | المعدات          |
| Inspection        | الفحص            |
| Observation       | الملاحظة         |
| Incident          | الحادث           |
| Investigation     | التحقيق          |
| Hazard            | مصدر الخطر       |
| Risk              | المخاطر          |
| Corrective action | الإجراء التصحيحي |
| Preventive action | الإجراء الوقائي  |
| Contractor        | المقاول          |
| Employee          | الموظف           |
| Team              | الفريق           |
| Objectives        | الأهداف          |
| Emergency drill   | تدريب الطوارئ    |

Technical standards such as ISO 45001, protocol names such as SMTP/TLS, record IDs, file names, URLs and brand names retain their identity. Existing custom organization/sidebar names remain user content.

## Backend requirements and remaining limits

1. The frontend sends the active language in `Accept-Language`. The backend must honor it for system-managed text, validation responses, notification titles/bodies and generated server documents.
2. Prefer stable error/status codes with structured interpolation parameters. Arbitrary human-language server messages cannot be translated reliably without losing meaning; meaningful unknown messages are preserved.
3. Bilingual managed records need the existing `titles`/`descriptions` locale arrays or supported localized fields. A single user-entered title is preserved; it is not machine translated.
4. WebSocket/push payloads need locale-specific text or translation keys/parameters. The browser/OS owns permission prompts, native file-picker chrome and native alert button text.
5. Route fixtures do not provide every feature's detail response. A route mounted with missing required record fields can fail independently of localization. Those failures must be retested with valid backend data before release.
6. Type checking already fails on the unchanged repository baseline. The audit compares diagnostics against that baseline; a successful production bundle is not evidence of a clean TypeScript project.
7. Automated script detection cannot approve domain wording or every layout state. Production acceptance still requires review with valid records, each permission-dependent flow and supported browsers, especially long Arabic text, sticky tables, exports and overlays.
8. The existing guard redirects anonymous forgot-password navigation to login. Authentication policy was preserved; the forgot-password component was checked with fixture authentication.
9. Styling and System Identity storage-flag edits were made concurrently in the shared workspace. Those settings were preserved. Storage-mode tests explicitly choose their code flag in intercepted Vite modules rather than changing the deployed flag.

## Reproduce checks

```sh
npm run build
npm run i18n:test
npm run i18n:audit
# Start a local Vite preview server before browser/route checks.
PROJECT_TEST_URL=http://127.0.0.1:5175 npm run i18n:browser
PROJECT_TEST_URL=http://127.0.0.1:5175 npm run i18n:routes
npm run type-check
```

The route crawler only accepts localhost and intercepts backend requests. By default it writes to the OS temporary directory to avoid triggering Vite reloads during its own run. Supply a report destination as the first argument to `scripts/localization/routes-smoke.mjs` to retain a run. Copy final reports into this directory after testing.

## Rules for future changes

Use `$t`/`useI18n` inside Vue, and the singleton `translate` helper in services. Keep translation keys in both catalogs, with matching interpolation variables. Use computed labels or `translationKey` metadata for module-level options. Never use a translated label as a filter or entity identifier.

Use logical spacing and `text-align: start`; retain physical coordinates for image cropping, diagrams and intentionally fixed geometry. Add `.locale-directional-icon` only where an icon's meaning depends on reading direction. Use `dir="auto"` or isolation for freeform content, and explicit LTR for technical inputs. A language-specific translation editor follows the language being edited, even when the surrounding interface uses the other language.
