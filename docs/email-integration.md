# Organization email integration

Implementation branch: `account-feature`.
Frontend route: `/organization/integrations/email` (Organization settings and sidebar).
Reference: https://app.fluxhubsa.com/w/techlab/integrations/email, inspected read-only on 2026-10-21, including the authenticated GET response and the published page module. No reference settings were changed and no reference connection check, retry, or email send was performed.

## Delivery and scope

The frontend is implemented in this repository. The HSE backend endpoints below must be implemented separately before the feature can persist settings or perform IMAP operations. There is no local-storage fallback, simulated success, SMTP connection from the browser, inbox implementation, or notification scheduler in this feature.

The reference uses `/api/workspaces/{slug}/integrations/email`. HSE uses its existing authenticated organization API scope instead of a workspace slug, with the same `integrations/email`, `sent-check`, and `sent-retry` suffixes, HTTP methods, configuration names, and version field. Responses use the existing HSE repository envelope. `can_manage` is an explicit HSE addition so the backend controls edit access; missing/false means read-only. The browser's user ID or an organization ID supplied by a client must never establish tenant scope.

## Architecture / frontend handoff

Feature root: `src/features/Organization/EmailIntegration/`.

| Layer                    | Files and responsibility                                                                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core/params              | `FetchEmailIntegrationParams`, `SaveEmailIntegrationParams`, `SentCopyActionParams`: serialize requests; `validateEmailDraft`: conditional credential and port checks |
| Data/apiServices         | Fetch/SaveEmailIntegration, Check/RetrySentCopy API services: shared authenticated network client, GET/PUT/POST                                                       |
| Data/models              | `EmailIntegrationModel`: allowlisted response, defaults, isolated editable draft; `SentCopyResultModel`: folder and counters                                          |
| Domain/repositories      | One repository per operation, using the existing `RepoInterface` response/error handling                                                                              |
| Domain/useCase           | One use case per operation, using the existing `UseCase` interface                                                                                                    |
| Presentation/controllers | `EmailIntegrationController`: page-owned state, loading, dirty baseline, validation, saved version, transient secrets, save/check/retry/reset                         |
| Presentation/components  | `EmailIntegration.vue`, `EmailField.vue`, scoped feature CSS                                                                                                          |
| Integration              | `ApiNames.EmailIntegration`, `.EmailSentCheck`, `.EmailSentRetry`; organization SettingRoutes; sidebar and settings tile; English/Arabic `emailSettings` translations |

Follow the existing PPETool layering. Services contain HTTP details, repositories parse responses, use cases call repositories, and the controller coordinates the view. The controller is per page, not a singleton: it must never persist draft passwords through Pinia or localStorage. The response model explicitly excludes secrets even if a backend accidentally returns them. No new npm dependencies.

### UI behavior

1. GET on entry. Display loading, errors with retry, or the saved configuration. GET HTTP 404 opens manual setup; other failed GET requests show an error rather than an editable default form.
2. A successful fetch with empty `data` (`null`, omitted, `[]`, or `{}`) opens the blank setup form with version 0, so settings can be entered manually. For this empty setup response, editing is enabled unless the response explicitly sets `can_manage: false`. For populated configurations, server-provided `can_manage` controls editing. Read access and update authorization are enforced separately by the backend.
3. SMTP defaults: STARTTLS/587; STARTTLS allows 587 or 2525, TLS allows 465. Changing security resets the port. IMAP is fixed at TLS/993.
4. Sender name uses the shared `LangTitleInput`, with account languages or the language API, matching the PPE Tool form; Arabic/English are the fallback if unavailable. At least one language must be nonempty; `from_name` prefers Arabic, then English, then the first nonempty configured language. All locale values travel in `config.translations.from_name`.
5. Existing passwords remain blank with saved-password hints. Empty SMTP and IMAP passwords are omitted from requests, never sent as a request to erase stored secrets. Changing the SMTP or independent IMAP host/username requires re-entering the corresponding secret. Password whitespace is preserved.
6. IMAP details appear only when enabled. Separate username/password appear only when SMTP credential reuse is off. A hidden independent IMAP password is not sent while reuse is on.
7. Save requires an account password and a dirty draft. Controls lock during requests. The successful response supplies the new version and becomes the reset baseline. Saving does not test SMTP or send mail.
8. Account and draft passwords are cleared after every completed save/check/retry request, successful or failed, and on discard/unmount. Other draft edits survive failed saves. Client validation failures make no request and retain the draft.
9. IMAP check/retry require saved, unchanged settings, enabled email, enabled Sent copy, edit access, and a freshly entered account password. Retry is shown only if failed count > 0. Account-password entry alone is not a configuration change.
10. Save/discard before in-app navigation; browser close/refresh has an unsaved-change prompt. Reload is enabled after discard; a conflict never silently overwrites a newer version. The controller also blocks navigation during an active request.
11. Counters come from the backend; a retry response updates them. Reload refreshes all settings and counts. A successful folder check does not mark SMTP as tested; the status remains saved/unverified.
12. Labels, feedback, and layout support English and Arabic; technical addresses and hosts are LTR. CSS stays under `.email-settings` and uses existing theme tokens.

## API contract

Base URL is the existing `ApiNames.baseUrl` (currently `https://api.hse.techlabeg.com/`). All endpoints use bearer authentication through the existing HSE client and the current tenant from the authenticated session. Send and receive JSON. Never log request bodies containing credentials.

| Operation                       | Method | Path                                          | Request                                            |
| ------------------------------- | ------ | --------------------------------------------- | -------------------------------------------------- |
| Read configuration and counters | GET    | `/organization/integrations/email`            | No body or query parameters                        |
| Save configuration              | PUT    | `/organization/integrations/email`            | `version`, `enabled`, `current_password`, `config` |
| Check IMAP Sent folder          | POST   | `/organization/integrations/email/sent-check` | `current_password` only                            |
| Requeue failed Sent copies      | POST   | `/organization/integrations/email/sent-retry` | `current_password` only                            |

### GET / PUT success model

HTTP 200 and the standard HSE envelope; `data` must be a non-null object for `RepoInterface`:

```json
{
  "status": true,
  "message": "Email settings loaded",
  "data": {
    "version": 4,
    "enabled": true,
    "status": "saved",
    "updated_at": "2026-10-21T10:00:00Z",
    "has_password": true,
    "has_imap_password": false,
    "can_manage": true,
    "config": {
      "host": "smtp.example.com",
      "port": 587,
      "security": "starttls",
      "username": "notifications@example.com",
      "from_email": "notifications@example.com",
      "from_name": "HSE Notifications",
      "reply_to": null,
      "translations": { "from_name": { "ar": "", "en": "HSE Notifications" } },
      "sent_copy": {
        "enabled": false,
        "host": "",
        "port": 993,
        "use_smtp_credentials": true,
        "username": "",
        "folder": ""
      }
    },
    "sent_copies": { "pending": 0, "failed": 0, "saved": 0 }
  }
}
```

`version`: integer >= 0, incremented atomically on every configuration save. Initial GET returns version 0, `updated_at: null`, `status: "not_configured"`, `enabled: false`, empty strings, SMTP587/starttls, IMAP993/reuse true, no stored-password flags, zero counters, and the caller's computed `can_manage`. Prefer returning this default object with 200 for a tenant without settings. A successful empty response is also supported and opens the manual setup form; an explicit `can_manage: false` in the envelope preserves read-only access. The frontend also treats GET HTTP 404 as an unconfigured state and opens manual setup, including when the endpoint is awaiting backend delivery. PUT/action errors still surface normally; displaying the form does not mean the backend can save settings. Authentication, permission, network and server errors remain errors.

`status`: `not_configured` or `saved` for this scope; saving is never evidence that a connection was tested. `updated_at`: nullable ISO8601 UTC. `can_manage`, enabled flags and stored-password flags are JSON booleans (not 0/1 or strings). Counts are nonnegative integers. Credentials are never returned, including encrypted ciphertext or masked placeholders. `from_name` provides a default sender display name, translations preserve all configured languages.

### PUT request

```json
{
  "version": 4,
  "enabled": true,
  "current_password": "<current HSE account password>",
  "config": {
    "host": "smtp.example.com",
    "port": 587,
    "security": "starttls",
    "username": "notifications@example.com",
    "password": "<new SMTP app password; omit to retain>",
    "from_email": "notifications@example.com",
    "from_name": "HSE Notifications",
    "reply_to": null,
    "translations": { "from_name": { "ar": "", "en": "HSE Notifications" } },
    "sent_copy": {
      "enabled": true,
      "host": "imap.example.com",
      "port": 993,
      "use_smtp_credentials": true,
      "username": "",
      "folder": ""
    }
  }
}
```

If `use_smtp_credentials:false`, send the independent `sent_copy.username` and optionally `sent_copy.password`. The frontend sends retained non-secret IMAP fields even while disabled; ignore them for connection eligibility while preserving configuration for re-enabling. `reply_to` is `null` when blank; folder is `""` for autodetection. PUT is a full non-secret configuration update. Unknown keys should be rejected, not mass assigned.

| Parameter                             | Type / validation                                                                                        |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| version                               | Required integer >= 0, must equal current saved version                                                  |
| enabled                               | Required boolean                                                                                         |
| current_password                      | Required string, validate against authenticated HSE user, never SMTP credentials                         |
| config.host                           | Required hostname, 1–253 characters; no URL/scheme/path/port or control characters                       |
| config.port                           | Required integer: starttls 587/2525; tls 465                                                             |
| config.security                       | Required `starttls` or `tls`; no unencrypted mode                                                        |
| config.username                       | Required nonempty string, max254                                                                         |
| config.password                       | Optional nonempty string, max2048; required for first setup or changed SMTP host/username                |
| config.from_email                     | Required valid email, max254; sender must be authorized by provider                                      |
| config.from_name                      | Required trimmed string, max160; disallow CR/LF/header injection                                         |
| config.translations.from_name         | Object keyed by configured locale codes, strings max160 each, at least one nonblank                      |
| config.reply_to                       | Nullable valid email, max254                                                                             |
| config.sent_copy.enabled              | Required boolean                                                                                         |
| config.sent_copy.host                 | Max253; required valid hostname when sent_copy.enabled                                                   |
| config.sent_copy.port                 | Required integer993; require TLS server-side                                                             |
| config.sent_copy.use_smtp_credentials | Required boolean; reuse stored/current SMTP secret server-side                                           |
| config.sent_copy.username             | Max254; required when enabled and not reusing SMTP                                                       |
| config.sent_copy.password             | Optional nonempty string max2048; required for new independent credentials or changed IMAP host/username |
| config.sent_copy.folder               | Optional string max255; blank for autodetection; disallow control characters                             |

Missing secrets retain existing encrypted values. Do not interpret blank as erase: either reject supplied empty secrets or normalize to omission. There is no clear-secret operation in this UI. Disabling the integration retains configuration and encrypted secrets. Never trim passwords.

### Sent-check

Request: `{ "current_password": "<current HSE account password>" }`.
HTTP 200: `{ "status": true, "message": "Sent folder checked", "data": { "folder": "INBOX.Sent" } }`.

Authorize, confirm enabled/saved settings, decrypt appropriate credentials server-side, connect with IMAP TLS/993, authenticate, and detect or verify the requested Sent folder and append capability. No email is sent, copied, moved, or deleted by this check. Use bounded timeouts and return a sanitized provider/connection error. SMTP itself is not tested.

### Sent-retry

Request: `{ "current_password": "<current HSE account password>" }`.
HTTP 200: `{ "status": true, "message": "Failed copies requeued", "data": { "sent_copies": { "pending": 3, "failed": 0, "saved": 20 } } }`.

Requeue only failed copy jobs belonging to the authenticated tenant. This endpoint never queues or invokes SMTP sending. Atomic claims/idempotency prevent duplicate retries or copies. Repeated requests may return current counters with no work. See worker requirements below.

### Errors

```json
{
  "status": false,
  "message": "Validation failed",
  "errors": { "config.host": ["A valid SMTP hostname is required."] }
}
```

Use HTTP 401 for expired/missing session; 403 for no read/manage access; 422 for validation or incorrect account password; 409 for stale `version`; 429 for throttling; 502 for provider authentication/connectivity failure; 503 for unavailable backend/queue. Examples are a proposed HSE backend contract, not assertions of unobserved reference server error behavior. The existing shared network layer flattens field errors into an alert; it does not retain field-level error metadata. Return sanitized user-facing messages and never echo passwords, request bodies, tokens, ciphertext, or raw provider traces.

On 409 return an explicit message such as "Email settings changed. Discard your changes and reload." Do not update any fields or secrets on failure. Frontend keeps the previous model/version, retains non-secret draft edits, clears secrets, and lets the user discard then reload. Ensure the backend transaction checks version before writing secrets/configuration and increments it exactly once.

## Backend implementation / persistence

Suggested models (storage naming is internal; public JSON above is fixed):

- OrganizationEmailSettings: unique organization_id FK, integer version, enabled, status, SMTP host/port/security/username, encrypted SMTP password, from_email/from_name/reply_to, JSON translations, Sent-copy enabled/host/port/reuse flag/username/folder, encrypted independent IMAP password, updated_at, updated_by. Compute password-presence flags; do not store a current account password.
- EmailSentCopyJob: organization_id FK, unique delivered_message_id within tenant, stable Message-ID, securely stored MIME reference (including attachments), target mailbox/folder snapshot, state pending/processing/saved/failed, attempt count, next_attempt_at, lease/claim token, sanitized error code, saved_at, created_at. Enforce tenant filtering and unique delivery identity.

Encrypt at rest with managed server keys, TLS in transit, key rotation support, and least-privilege decrypt access. Redact secrets in request/APM/debug/audit logs, jobs, exception handlers, and analytics. Audit actor, tenant, action and changed non-secret field names only. Return `Cache-Control: no-store` on settings and action responses; avoid caching sensitive usernames/configuration in intermediaries. All endpoints require tenant authorization; manage operations additionally require admin permission and current-account-password reauthentication. Rate-limit password confirmation and connection checks.

Validate SMTP/IMAP targets server-side to prevent SSRF: reject local/private/link-local/metadata targets and unsafe resolved addresses (IPv4 and IPv6); handle DNS rebinding by checking and pinning validated connection addresses; use the supplied hostname for TLS/SNI verification. Enforce allowed ports, valid certificates, bounded connection timeouts, and resource limits. Never accept arbitrary protocols or disable certificate verification.

### Outgoing notification / Sent-copy worker

This settings screen alone does not activate notification templates or schedules. The existing backend sender must explicitly integrate these settings:

1. Send only through SMTP when tenant integration and the separately configured notification workflow permit it. Persist successful delivery and stable Message-ID once.
2. After SMTP succeeds, enqueue a copy job only if Sent copy was enabled at delivery time. Store/reuse the exact MIME body and attachments. Do not retroactively enqueue previous messages.
3. Append MIME to the configured or autodetected Sent folder via IMAP TLS. SMTP credential reuse is resolved server-side, never by returning stored secrets to the browser.
4. Retry append failures with backoff for at most five attempts per cycle; exhausted jobs become failed. Never re-run SMTP during copy retry. Define manual retry as a new explicit retry cycle for failed jobs only; retain lifetime attempts for audit.
5. Use atomic job leases and check the stable Message-ID after ambiguous IMAP responses/timeouts before retrying append. Do not claim exactly-once append from IMAP alone: reconcile ambiguous outcomes to avoid duplicate copies.
6. Derive pending/failed/saved counters from tenant-scoped durable job states. Manual retry updates counters atomically. Worker jobs must not leak across organizations or to a newly changed mailbox without an explicit target-snapshot policy.

## Verification

Automated browser tests use mocked HSE endpoints only; fixtures must intercept all remote writes. Cover authenticated load, SMTP security/port changes, bilingual sender editing, IMAP branches, stored-secret omission, current-password confirmation, success baseline/version, 409 preserving non-secret edits, secret clearing, check/retry request shape, read-only access, failed initial load/retry, navigation protection and mobile/Arabic rendering. Pure contract tests cover serializers, allowlisted models and conditional validation. Real SMTP/IMAP and encryption/authorization/worker behavior require backend integration tests after backend delivery.

### Run frontend checks

```sh
npx tsx src/features/Organization/EmailIntegration/tests/contract.test.ts
# Start Vite on port 5190, or set EMAIL_TEST_URL to the existing local server.
node src/features/Organization/EmailIntegration/tests/browser.test.mjs
npx eslint src/features/Organization/EmailIntegration src/views/Organization/EmailIntegration.vue
npm run build
```

Contract tests, mocked browser checks, feature ESLint, and the production build passed during implementation. The full repository TypeScript check currently reports existing errors outside this feature (including duplicate CrudType enums in the shared API service); it is not a clean project-wide gate. No new feature TypeScript diagnostics were reported. Real backend operations remain pending backend implementation.
