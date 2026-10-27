# Feature documentation

The organization sidebar exposes Documentation → All guides and 13 feature guides: Project, Equipment, Employees, Observations, Incidents, Inspections, Investigations, CAPA, Induction, PPE Matrix, PPE Delivery, Objectives & Progress, and Internal Audit.
The catalog is `/organization/documentation`; guides use `/organization/documentation/:feature`.

To add another feature:

1. Add a bilingual `FeatureGuide` content module and register it in `guides.ts`, with a unique slug, navigation translation key, steps, prerequisites, overview guidance, and FAQs.
2. Add that navigation key to `src/locales/en.json` and `src/locales/ar.json`.
3. Put the real walkthrough GIF and a static WebP poster in `public/documentation/<feature>/` and reference them in the guide.

The catalog, guide route, contents navigation, and sidebar links are generated from this registry. Existing saved sidebar layouts receive new destinations through the normal identity layout migration.

Animation starts only when the reader selects Play and stops by restoring the poster. This avoids automatic motion and loading the GIF before it is requested.

## Project recording

Recorded from the live project wizard on 2026-10-26 using the supplied test company account. The demonstration project is ID 11, titled “Project Setup Guide Demo” / “مشروع توضيحي لدليل الإعداد”. All five save endpoints succeeded; setup readiness reached 100%. The project includes one location, zone, position, employee, team, and equipment assignment, plus Friday/Saturday holidays.

The GIF contains actual browser screenshots from Projects → Basic data → Holidays → Positions → Teams → Equipment → Projects → Project summary. Repeated idle frames were shortened; the login screen and credentials are excluded. The poster shows the completed project summary. The recording creates no additional records when viewed.

Verify with `PROJECT_TEST_URL=http://127.0.0.1:5180 npx playwright test scripts/documentation.spec.mjs`. Browser verification intercepts remote API requests with local fixtures and does not modify production.

## Additional feature guides

Guides now live in `content/`, with their shared types in `types.ts` and registry in `guides.ts`. Add a content module, import it into the registry, and add its locale navigation key. Set its `actionLabel` and `startRoute` to the feature entrypoint. Add its view permissions in `documentationFeaturePermissions` in `organizationNavigation.ts`; the All guides sidebar entry combines those permissions.

Each guide has a `recordings` array. Equipment has Owned and Rented recordings; the viewer switches the poster and description and stops playback whenever another recording or guide is selected. Each GIF is requested only after Play is selected.

Original recordings were made on 2026-10-26 using actual form submissions in the supplied test company account. Equipment and incident recordings were replaced on 2026-10-27 as described below:

| Cycle            | Created record                            | Result                                                                                                                                               |
| ---------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owned equipment  | 84, Documentation Demo - Owned Equipment  | Saved and opened in equipment details; rental dates hidden                                                                                           |
| Rented equipment | 85, Documentation Demo - Rented Equipment | Saved with a contractor; 2 months from 2026-11-01 yields 2027-01-01                                                                                  |
| Employee         | 67, Documentation Demo Employee           | Saved with a position, regular employee access, dashboard access off                                                                                 |
| Observation      | 34                                        | Demo project; Negative, Low risk, Closed; immediate action saved                                                                                     |
| Incident         | 35                                        | Existing Test Project; no witnesses, injuries, or fatalities; immediate action and Not Applicable PTW saved, then status changed from Open to Closed |

The demo project starts in the future. The incident API rejected dates before project start and after today without creating records, so the final incident recording uses the account's existing Test Project and today's date. The guide explains both date restrictions. The saved safety records explicitly say they are documentation scenarios.

The employee example uses a reserved example.com email and a reserved US example phone number. Its generated password was masked and dashboard access was disabled. The test account's phone cell is blurred in recorded employee tables. No login screens, credentials, or authentication storage are included in the published media.

Generate GIFs from recorded PNG frames with Pillow:

```sh
python3 scripts/build-documentation-gif.py /path/to/recording public/documentation/equipment/equipment-owned.gif --start-index 6
```

Input is `frames.json` with `{ "file": "frame-00000.png", "duration": 250 }` entries and a sibling `frames/` directory. `--start-index` trims navigation from the preceding feature; idle duplicates are shortened. The script also writes a WebP poster using the final recorded frame. It does not log in, submit forms, or synthesize screens. The browser verification fixtures intercept remote API requests, including writes.

## Equipment and incident re-recording — 2026-10-27

The current owned/rented equipment and incident GIFs were re-recorded using the current local checkout at `http://127.0.0.1:5173`, authenticated against the real production API. Equipment application code, styling, and guide content were preserved. The existing GIF and poster paths were replaced.

| Current recording | Created record                               | Verified result                                                                                                                                                     |
| ----------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owned equipment   | 87, Documentation Demo - Owned Equipment v2  | Saved, displayed in the registry, opened in details; rental dates hidden                                                                                            |
| Rented equipment  | 88, Documentation Demo - Rented Equipment v2 | Saved with contractor and 2 months from 2026-11-01 to 2027-01-01                                                                                                    |
| Incident          | 36                                           | Test Project; one staff witness, one injury with left forearm selected and Safety Gloves / Good, and one staff fatality; saved and changed to Closed, then reloaded |

Employee 67 (Documentation Demo Employee, an existing demo profile) was used for the witness and injury. A separate regular employee with dashboard access disabled was created specifically for the fatality: 70, Documentation Fatality Demo - 2026-10-27. The scenario and all notes explicitly state that no real injury or fatality occurred.

The fatality employee was present in the employee list before submission. After saving the incident, fresh active employee selectors excluded employee 70, while the administrative employee list still returned the profile. The incident retained all three people sections and the fatality name. The GIF shows all three expanded form sections, the body map front/back views, saved people records, closure, the employee dropdown excluding the fatality profile, and a return to the saved incident. The bilingual guide distinguishes hiding from active selectors from deleting the administrative profile or incident history.

## Expanded workflows — 2026-10-27

Documentation now includes Inspection, Investigation, CAPA, Induction, PPE Matrix, PPE Delivery,
Objectives & Progress, and Internal Audit, with English and Arabic instructions. Inspection covers
Employee, Machine/equipment and Zone assignments, AD-HOC and every Periodic schedule mode.
Internal Audit has three selectable recordings: plan/attendance, NCR, and report.

These recordings use the production UI at `sys.hse.techlabeg.com` and real submissions under the
supplied test company account. No mock data was injected into the recorded UI. Each new safety
record states that it is a documentation simulation. Existing equipment recordings are preserved.

| Recording           | Demo record / verified outcome                                                                                                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Updated incident    | Incident 37 / serial 7, witness and injury employee 67, dedicated fatality employee 71; clicked Left Forearm on the actual body diagram, opened all three saved sections, changed action status to Closed                        |
| Employee inspection | Task 18; Test Project, dsadas zone, emp 1, OSHA 1926 system checklist, AD-HOC; saved assignment and checklist preview, opened its empty results history (no inspection submission was claimed)                                   |
| Investigation       | Investigation 33 / serial 8, meeting 14; team and leader assigned, In Progress evidence/timeline/5 Whys/action plan entered, closed and opened its complete saved report                                                         |
| CAPA                | CAPA 47 / serial 45, corrective task 48; In Progress → Completed, effectiveness review 2 saved as Effective; preventive task remains Not Started                                                                                 |
| Induction           | Induction 9; TestCompany instructor, employee 67 and a demonstration visitor, PPE training topic; saved and opened overview                                                                                                      |
| PPE matrix          | New activity 76, Documentation demo - manual handling; linked protective gloves tool 14                                                                                                                                          |
| PPE delivery        | Project 2 with location/zone; activity 76, employee 67, gloves 14; successful save and checkmark in PPE log                                                                                                                      |
| Objectives          | Objective 26, target 10 briefings; progress record 43 for October 2026, actual 3, displayed progress 30%                                                                                                                         |
| Internal audit      | Audit 8 / serial 2; published today, both meeting attendance values saved for employees 3 and 67; NCR 15 / serial 2 saved with actions and report issued, then reopened in Preview with persisted attendance, NCR and conclusion |

The investigation form rejected an “Other” factor with a backend validation error; the successful
record uses a listed factor instead. No duplicate result was created. The recordings show real
interface states, including validation where encountered. The final report does not imply that
all NCR actions are complete. Raw recording frames, browser authentication and write audit logs
remain outside the repository; published assets contain no login or credential screens.

Browser documentation tests cover every registered guide, all recording assets and controls,
Arabic mobile layout, sidebar navigation and restricted employee permission access. They use
local request fixtures and make no production changes.
