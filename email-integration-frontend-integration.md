# Frontend integration: organization email

This guide connects the frontend page `/organization/integrations/email` to the
implemented HSE backend. It describes HTTP calls and the corresponding UI actions.
The Vue feature and its browser tests live in the frontend repository, not this
backend repository. See the [implementation overview](README.md) for persistence,
deployment, transport security and worker details.

## Connection and access

Use the existing authenticated HSE network client and its configured API base URL.
For the supplied frontend configuration, the example full read URL is
`https://api.hse.techlabeg.com/organization/integrations/email`. This is a URL
example, not confirmation that these changes have been deployed there. Local or
staging environments must use their own backend URL.

The paths below use the default `organization` route prefix. Do not add `/api`,
a workspace slug, an organization ID or a user ID. The authenticated employee
session selects the tenant. Query parameters are not accepted.

Send these headers on every request:

```http
Accept: application/json
Authorization: Bearer <existing employee access token>
```

Also send `Content-Type: application/json` for PUT and POST. Responses use the
existing HSE envelope and `Cache-Control: no-store`. Use the shared client's
existing authentication and error handling; do not log credential-bearing bodies.

Every authenticated organization dashboard user can read. Only organization
admins can save, check or retry. Read `data.can_manage` from GET/PUT to decide
whether to enable editing; for a populated configuration, anything other than
`true` means read-only. Master/full-permission flags alone do not grant management.
The backend independently enforces these rules.

## Actions and their effects

| Frontend action | Request | Backend effect | Frontend result |
|---|---|---|---|
| Open page / Reload | GET `/organization/integrations/email` | Read configuration and current counters; an initial read creates no settings row | Replace saved model, editable draft and version from `data` |
| Save / enable / disable | PUT `/organization/integrations/email` | Atomically save full configuration and increment version once | Replace the baseline with the successful response; mark draft clean |
| Check Sent folder | POST `/organization/integrations/email/sent-check` | Use saved credentials to inspect the IMAP folder without appending a message | Display `data.folder` as feedback; keep configuration, version and SMTP status unchanged |
| Retry failed copies | POST `/organization/integrations/email/sent-retry` | Requeue only this tenant's failed IMAP copy jobs | Update counters from `data.sent_copies`; completion happens asynchronously |
| Discard | No HTTP request | None | Restore the saved baseline and clear all entered passwords |

Saving does not test SMTP or send email. A successful folder check does not test
SMTP either. Retry never sends SMTP mail. Existing notification senders remain
unchanged: enabling these settings does not activate notification workflows or
start generating Sent-copy jobs. There is no inbox or send/test-email endpoint.

## 1. Load configuration

```http
GET /organization/integrations/email
```

Send no body. HTTP 200 for an admin with no saved configuration:

```json
{
  "status": true,
  "message": "Email settings loaded",
  "data": {
    "version": 0,
    "enabled": false,
    "status": "not_configured",
    "updated_at": null,
    "has_password": false,
    "has_imap_password": false,
    "can_manage": true,
    "config": {
      "host": "",
      "port": 587,
      "security": "starttls",
      "username": "",
      "from_email": "",
      "from_name": "",
      "reply_to": null,
      "translations": { "from_name": { "ar": "", "en": "" } },
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

For a dashboard reader, `can_manage` is `false`. For saved settings, GET returns
the same `data` shape as the successful PUT example below, with message
`Email settings loaded`. Counts reflect durable jobs at read time; `pending`
includes jobs currently processing.

Keep an isolated editable copy of `data.config` and `data.enabled`, plus the saved
`version`. Password inputs start blank even when presence flags are true. Show a
saved-password hint from those flags, never a masked value submitted as a password.
`status: saved` means saved/unverified, not connected or tested.

For compatibility with the frontend handoff, GET 404 opens manual setup, and a
successful empty `data` (`null`, omitted, `[]` or `{}`) opens defaults at version 0.
For that empty-response fallback only, enable editing unless the envelope
explicitly contains `can_manage: false`. The implemented backend normally returns
the full object above, including permissions. A 404 can mean the backend is not
deployed; showing setup does not imply saves will work. Other failed GET requests
must show a load error with Retry, rather than an editable default form.

## 2. Save configuration

```http
PUT /organization/integrations/email
```

First-save request, enabling email and Sent copy with SMTP credential reuse:

```json
{
  "version": 0,
  "enabled": true,
  "current_password": "<current HSE account password>",
  "config": {
    "host": "smtp.example.com",
    "port": 587,
    "security": "starttls",
    "username": "notifications@example.com",
    "password": "<new SMTP app password>",
    "from_email": "notifications@example.com",
    "from_name": "إشعارات السلامة",
    "reply_to": null,
    "translations": {
      "from_name": { "ar": "إشعارات السلامة", "en": "HSE Notifications" }
    },
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

Replace example hosts, addresses and passwords with authorized provider settings.
Example hostnames are placeholders; saving resolves real public DNS targets and
can reject an unavailable or unsafe target. Saving does not connect to SMTP/IMAP.

HTTP 200 response (timestamp illustrative):

```json
{
  "status": true,
  "message": "Email settings saved",
  "data": {
    "version": 1,
    "enabled": true,
    "status": "saved",
    "updated_at": "2026-10-21T10:00:00+00:00",
    "has_password": true,
    "has_imap_password": false,
    "can_manage": true,
    "config": {
      "host": "smtp.example.com",
      "port": 587,
      "security": "starttls",
      "username": "notifications@example.com",
      "from_email": "notifications@example.com",
      "from_name": "إشعارات السلامة",
      "reply_to": null,
      "translations": {
        "from_name": { "ar": "إشعارات السلامة", "en": "HSE Notifications" }
      },
      "sent_copy": {
        "enabled": true,
        "host": "imap.example.com",
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

Replace the entire baseline with this response, including the returned version,
normalized configuration, flags and counters. Do not increment the version locally.
Passwords and ciphertext are never returned.

### Updating while retaining secrets

Every PUT is a full non-secret configuration update, not a partial patch. Build
`config` from the editable allowlisted fields, not the entire response object.
Send the last successful GET/PUT version and a freshly entered account password.
For example, after the save above, this request disables email while retaining
both the existing SMTP password and the Sent-copy configuration:

```json
{
  "version": 1,
  "enabled": false,
  "current_password": "<fresh current HSE account password>",
  "config": {
    "host": "smtp.example.com",
    "port": 587,
    "security": "starttls",
    "username": "notifications@example.com",
    "from_email": "notifications@example.com",
    "from_name": "إشعارات السلامة",
    "reply_to": null,
    "translations": {
      "from_name": { "ar": "إشعارات السلامة", "en": "HSE Notifications" }
    },
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

Its successful response has the same complete shape, `version: 2`,
`enabled: false`, `status: saved`, `has_password: true` and a new timestamp.
Re-enabling uses another full PUT with `enabled: true` and the latest version.
Disabling only Sent copy instead changes `config.sent_copy.enabled` to `false`.
Keep its non-secret fields in the request so they remain available for re-enabling.

### Independent IMAP credentials

To use a different IMAP login, replace `config.sent_copy` in a full PUT with the
following object. This fragment is not a standalone request:

```json
{
  "enabled": true,
  "host": "imap.example.com",
  "port": 993,
  "use_smtp_credentials": false,
  "username": "sent-archive@example.com",
  "password": "<new independent IMAP app password>",
  "folder": "INBOX.Sent"
}
```

The save response omits `sent_copy.password` and sets `has_imap_password: true`.
Subsequent unchanged independent credentials can omit that password. With reuse
enabled, never send `sent_copy.password`; the backend resolves SMTP credentials.
A blank folder `""` requests autodetection. An explicit folder must already exist;
Check does not create one.

### Serializer and validation rules

| Field / branch | Frontend rule |
|---|---|
| `version`, ports, flags | Send actual JSON integers and booleans, not strings or 0/1 flags |
| SMTP security | Default `starttls`/587; allow 587 or 2525 for `starttls`, 465 for `tls`; changing security resets the port |
| Mail hosts | Public DNS hostnames, max 253; no scheme, path, port, IP literal or control characters |
| SMTP username | Required, max 254 |
| Sender / reply-to email | Valid email, max 254; blank reply-to becomes `null` |
| Sender names | Both `ar` and `en` strings, max 160 each; at least one nonblank; `from_name` equals trimmed Arabic when nonblank, otherwise trimmed English |
| IMAP | Fixed TLS/993; host required when enabled; independent username required when enabled without reuse, max 254 |
| Folder | Max 255, no control characters; `""` for autodetection |
| New mail passwords | Nonempty strings, max 2048; preserve whitespace; omit an empty input rather than sending `""` or `null` |
| Account password | Required for each write/action, max 2048; preserve whitespace; this is the HSE account password |

First SMTP setup or a changed SMTP host/username requires the SMTP password,
even if saving with email disabled. Enabled independent IMAP requires a secret
when none is saved or its host/username changes. A changed independent identity
also requires re-entry while disabled if an independent secret was already saved.
Secrets are bound to their credential identity: changing hidden fields during
SMTP reuse does not authorize an old independent secret for a new mailbox.
Use the returned `has_imap_password` hint rather than assuming it remains valid.

Hide IMAP details when Sent copy is off and independent inputs when reuse is on.
Retain non-secret hidden fields, but omit hidden independent passwords during
reuse. Unknown keys are rejected at every request object level; do not send
response-only fields such as `can_manage`, counters or password-presence flags.

## 3. Check the saved Sent folder

```http
POST /organization/integrations/email/sent-check
```

Request:

```json
{
  "current_password": "<fresh current HSE account password>"
}
```

HTTP 200:

```json
{
  "status": true,
  "message": "Sent folder checked",
  "data": { "folder": "INBOX.Sent" }
}
```

Enable Check only for an admin with saved, unchanged settings, enabled email,
enabled Sent copy and a freshly entered account password. The endpoint accepts
only the account password, so unsaved connection settings cannot be checked.
It authenticates through IMAP TLS/993, detects/verifies the Sent folder and
checks append eligibility without appending any message. Show the returned folder
as feedback; do not silently save it, change the draft or mark SMTP as tested.

## 4. Retry failed Sent copies

```http
POST /organization/integrations/email/sent-retry
```

Request:

```json
{
  "current_password": "<fresh current HSE account password>"
}
```

HTTP 200 example:

```json
{
  "status": true,
  "message": "Failed copies requeued",
  "data": { "sent_copies": { "pending": 3, "failed": 0, "saved": 20 } }
}
```

Use the same eligibility conditions as Check, and show Retry only when the
backend reports `failed > 0`. Update counters without replacing the saved
configuration/version. A repeated request can return current counters with no
work. Reload with GET to refresh all settings and counts.

Retry requires backend deployment of the durable worker and
`ORGANIZATION_EMAIL_SENT_COPY_WORKER_ENABLED=true`; otherwise it returns 503.
An accepted retry means queued, not copied successfully. Existing jobs keep their
delivery-time mailbox snapshot even after settings change. Frontend calls neither
start the worker nor queue SMTP sends.

## Errors and recovery

Check both the HTTP status and the HSE envelope. Error responses may omit `data`
and `errors`; do not require either key. For example, incorrect account password
returns HTTP 422:

```json
{
  "status": false,
  "message": "Validation failed",
  "errors": {
    "current_password": ["The account password is incorrect."]
  }
}
```

The same shape carries field errors such as `config.host`, `config.password` or
`config.sent_copy.password`. The existing shared frontend network layer flattens
these into an alert; field-level presentation requires explicitly retaining the
metadata. Never display or log a request body with an error.

HTTP 409:

```json
{
  "status": false,
  "message": "Email settings changed. Discard your changes and reload."
}
```

| Status / failure | Frontend handling |
|---|---|
| 401 | Use the existing expired-session/login flow |
| 403 | Respect read/manage denial; a non-admin can read but cannot perform mutations |
| GET 404 | Manual setup fallback described above; deployment may still be missing |
| 405 | Check the method: Save requires PUT, not POST |
| 409 | Keep non-secret draft edits and the old version; ask the user to discard, then GET the newer baseline before manually reapplying changes |
| 422 | Display validation/password/action-eligibility feedback; retain non-secret edits |
| 429 | Respect `Retry-After` when present; allow a fresh manual attempt later |
| 502 | Display the sanitized DNS/provider/TLS/IMAP failure; do not mark anything tested |
| 503 | Display unavailable-backend/worker feedback; retry can report `The Sent-copy worker is unavailable.` |
| Network failure | Show failure without claiming success; a lost save response can follow a committed save, so reload the baseline before another save |

Never silently increment a stale version, overwrite a conflict or automatically
replay a password-bearing request. Save/check/retry share a limit of five calls
per actor/tenant per minute and 20 per source IP per minute; Check additionally
allows three per tenant per minute. Failed password confirmations consume limits.

## Frontend state and navigation

Keep the controller page-owned. Do not persist draft passwords in Pinia,
localStorage, analytics or logs. Build requests with an allowlist, and keep secrets
out of the response model even if an unexpected backend field appears.

Enable Save only when the admin has a dirty draft and an account password.
Account-password entry alone does not make configuration dirty. Lock controls and
block navigation during any active request. Clear the account password and both
draft provider passwords after every completed Save/Check/Retry request, whether
successful or failed, and on Discard/unmount. Use `finally` for this cleanup.
Client-side validation failures make no request and retain the draft.

On a failed Save, preserve other draft edits and the previous saved model/version.
On successful Save, use the full returned configuration as the reset baseline.
Before in-app navigation with changes, offer Save or Discard and wait for that
action to finish. Warn on browser close/refresh with unsaved changes. Reload is
available after Discard; do not use reload to silently erase a dirty draft.

Render English/Arabic labels and feedback. Keep addresses and hosts LTR, support
mobile layouts, and scope feature styles under `.email-settings` using theme tokens.

## Running the calls from the frontend

Keep the existing frontend layering: API services own the method/path, repositories
unwrap the HSE envelope, use cases call repositories, and the page controller owns
draft state and actions. This fetch example illustrates the wire contract when
checking a local/staging integration; production services should use the existing
authenticated client rather than introducing another client.

```js
// Supply your configured backend base URL and the existing employee token.
function emailApi(baseUrl, token) {
  const url = new URL("organization/integrations/email", baseUrl.replace(/\/?$/, "/"));

  async function request(method, suffix = "", body) {
    const response = await fetch(`${url}${suffix}`, {
      method,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.status !== true) {
      throw Object.assign(new Error(payload?.message ?? "Email request failed"), {
        httpStatus: response.status,
        errors: payload?.errors ?? {},
        retryAfter: response.headers.get("Retry-After"),
      });
    }
    return payload.data;
  }

  return {
    load: () => request("GET"),
    save: (payload) => request("PUT", "", payload),
    check: (currentPassword) => request("POST", "/sent-check", {
      current_password: currentPassword,
    }),
    retry: (currentPassword) => request("POST", "/sent-retry", {
      current_password: currentPassword,
    }),
  };
}
```

Call `load()` on entry. Pass the complete PUT example shape to `save(payload)`
with the current version and current input values. Pass only the newly entered
HSE account password to `check(password)` or `retry(password)`, after checking
the conditions above. The caller must apply the error/fallback rules and clear
password inputs in `finally`; these helpers do not own UI state or initiate calls.

For local verification, mock all remote writes and IMAP actions. Cover first
load, read-only access, both security/port modes, Arabic/English sender fallback,
IMAP reuse/independent branches, secret omission, successful version/baseline,
409 recovery, secret cleanup, exact action bodies, navigation and mobile/Arabic
rendering. Real backend deployment and provider checks require a configured test
environment; examples here are not evidence of a production connection.

## Backend contract references

- [Routes](../../../../app/Modules/Organization/Http/Routes/Dashboard.php)
- [Save validation](../../../../app/Modules/Organization/Http/Requests/Dashboard/EmailIntegration/SaveEmailIntegrationRequest.php)
- [Action validation](../../../../app/Modules/Organization/Http/Requests/Dashboard/EmailIntegration/SentCopyActionRequest.php)
- [Response resource](../../../../app/Modules/Organization/Http/Resources/Dashboard/EmailIntegration/EmailIntegrationResource.php)
- [Use case and action effects](../../../../app/Modules/Organization/Application/UseCases/EmailIntegration/EmailIntegrationUseCase.php)
- [OpenAPI schemas](../../../../app/Modules/Organization/Http/Resources/Dashboard/EmailIntegration/EmailIntegrationSchemas.php)
