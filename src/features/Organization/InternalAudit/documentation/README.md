# Internal Audit API Documentation

This folder documents the endpoints, request parameters, response models, enums, and test-environment behavior implemented in `src/features/Organization/InternalAudit`.

## Modules

- [Plan](./plan.md)
- [Attendance](./attendance.md)
- [NCRs](./ncrs.md)
- [Reports](./reports.md)

## Endpoint Summary

| Module | Method | Endpoint | Purpose |
| --- | --- | --- | --- |
| Plan | `POST` | `/create_internal_audit` | Create or save a draft audit plan |
| Plan | `POST` | `/fetch_internal_audits` | Fetch paginated audit plans |
| Plan | `POST` | `/fetch_internal_audit_details` | Fetch one audit plan |
| Plan | `POST` | `/update_internal_audit` | Update an audit plan |
| Plan | `POST` | `/delete_internal_audit` | Delete an audit plan |
| Attendance | `POST` | `/fetch_internal_audit_attendance` | Fetch attendance rows |
| Attendance | `POST` | `/change_internal_audit_attendance_status` | Toggle one meeting status for one row |
| NCRs | `POST` | `/fetch_ncrs` | Fetch paginated NCRs |
| NCRs | `POST` | `/create_ncrs` | Create an NCR and its CAPA |
| Reports | `POST` | `/fetch_internal_audit_plan_details` | Fetch audit details for the report |
| Reports | `POST` | `/create_internal_audit_report` | Create the audit report |

All endpoints require authentication and currently use `POST`.

## Standard Responses

### Response with data

```ts
{
  status: true,
  message: string,
  data: unknown
}
```

### Paginated response

Used by `/fetch_internal_audits` and `/fetch_ncrs`.

```ts
{
  status: true,
  message: string,
  data: {
    data: unknown[],
    meta: {
      from: number,
      per_page: number,
      to: number,
      current_page: number,
      last_page: number,
      total: number
    }
  }
}
```

### Mutation response without data

Create, update, delete, attendance status, NCR creation, and report creation repositories use `ResponseType.withoutData` in development and production.

```ts
{
  status: true,
  message: string
}
```

## Environment Behavior

Every Internal Audit use case is routed through `UseCaseHandler`:

```ts
return UseCaseHandler.instance().handle({
  onTest: () => new DataSuccess({ data: Model.example }),
  onDev: () => Repository.getInstance().call(params),
  onProduction: () => Repository.getInstance().call(params),
})
```

- `test`: no API request is made; the use case returns its static model example.
- `dev`: calls the configured API repository.
- `production`: calls the same configured API repository.
- List use cases return the example array; single-item and mutation use cases return one example model in test mode.

## Exact Backend Keys

Some request and response keys intentionally preserve the current backend contract spelling. Do not correct them only on the frontend:

- `audit_standern_id`
- `depertment_id`
- `audit_activitys`
- `audit_foucse_id`
- `assigend_auditors_id`
- `internal_audit_attendace_id`
- `rquiriment_refrence`
- `correcive_action`
- `assgined_to_id`
- `scopr`
- attendance response alias `pisition`

## Attachments

Activity, NCR, and report attachments are sent as arrays of Base64 strings:

```ts
attachments: string[]
report_attachments: string[]
```

