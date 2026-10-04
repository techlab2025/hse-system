# Internal Audit Plan

## Enums

```ts
enum InrernalAuditStatusEnum {
  draft = 1,
  planned = 2,
  reported = 3,
}
```
## Request Types

```ts
type AuditTeamMember = {
  organization_employee_id: number
  is_leader: boolean
}

type AuditScope = {
  depertment_id: number
  audit_activitys: Array<{
    audit_activity_id: number
  }>
}

type AuditSchedule = {
  start_time: string
  end_time: string
  day: string
  audit_foucse_id: number
  location: string
  assigend_auditors_id: number
  general_instructions: string
  attachments: string[] // Base64 file strings
}

type InternalAuditPlanRequest = {
  audit_start_date: string
  audit_end_date: string
  project_id?: number
  full_company: boolean
  audit_standern_id: number
  audit_team: AuditTeamMember[]
  audit_scope: AuditScope[]
  audit_schedule: AuditSchedule[]
  is_draft: boolean
}
```


## Response Model

```ts
type InternalAuditPlanModel = {
  id: number
  title: string
  auditStartDate: string
  auditEndDate: string
  status: string
  project: { id: number; title: string } | null
  fullCompany: boolean
  auditStandard: { id: number; title: string } | null
  auditTeam: unknown[]
  auditScope: unknown[]
  auditSchedule: unknown[]
  serial_name: string
  serial_number: string
}
```

The mapper reads these API keys:

```ts
{
  id: number,
  title?: string,
  audit_number?: string,
  audit_start_date: string,
  audit_end_date: string,
  status: string,
  project: { id: number, title: string } | null,
  full_company: boolean,
  audit_standard: { id: number, title: string } | null,
  audit_team: unknown[],
  audit_scope: unknown[],
  audit_schedule: unknown[],
  serial_name: string,
  serial_number: string
}
```

## 1. Create Plan

`POST - /create_internal_audit`

### Request

```ts
{
  audit_start_date: "2026-10-04",
  audit_end_date: "2026-10-05",
  project_id: 1,
  full_company: false,
  audit_standern_id: 1,
  audit_team: [
    { organization_employee_id: 101 },
    { organization_employee_id: 102}
  ],
  leader_id:101,
  audit_scope: [
    {
      depertment_id: 22,
      audit_activitys: [
        { audit_activity_id: 5 },
        { audit_activity_id: 6 }
      ]
    }
  ],
  audit_schedule: [
    {
      start_time: "09:00",
      end_time: "12:00",
      day: "2026-10-04",
      audit_foucse_id: 5,
      location: "Maintenance Workshop",
      assigend_auditors_id: 101,
   
    }
  ],
    general_instructions: "Review maintenance records before the meeting.",
    attachments: ["JVBERi0xLjQ..."],
  is_draft: false
}
```

### Response

Production and development expect a message-only success response:

```ts
{
  status: true,
  message: "Internal audit created successfully"
}
```

Test mode returns `InternalAuditPlanModel.example`.

## 2. Fetch Plans

`POST - /fetch_internal_audits`

### Request

```ts
{
  word?: string, // omitted when empty
  paginate: number,
  page: number,
  limit: number
}
```

Example:

```ts
{
  word: "IA-2026",
  paginate: 1,
  page: 1,
  limit: 10
}
```

### Response

```ts
{
  status: true,
  message: "Internal audits fetched successfully",
  data: {
    data: [
      {
        id: 12,
        audit_number: "IA-2026-0012",
        audit_start_date: "2026-10-04",
        audit_end_date: "2026-10-04",
        status: "planned",
        project: { id: 1, title: "Central Operations Project" },
        full_company: false,
        audit_standard: { id: 1, title: "ISO 45001:2018" },
        audit_team: [],
        audit_scope: [],
        audit_schedule: []
      }
    ],
    meta: {
      from: 1,
      per_page: 10,
      to: 1,
      current_page: 1,
      last_page: 1,
      total: 1
    }
  }
}
```

## 3. Fetch Plan Details

`POST - /fetch_internal_audit_details`

### Request

```ts
{
  internal_audit_id: number
}
```

### Response

```ts
{
  status: true,
  message: "Internal audit details fetched successfully",
  data: {
    id: 12,
    audit_number: "IA-2026-0012",
    audit_start_date: "2026-10-04",
    audit_end_date: "2026-10-04",
    status: "planned",
    project: { id: 1, title: "Central Operations Project" },
    full_company: false,
    audit_standard: { id: 1, title: "ISO 45001:2018" },
    audit_team: [
      { employee: { id: 101, name: "Sara Ibrahim" }, is_lead_auditor: true }
    ],
    audit_scope: [],
    audit_schedule: []
  }
}
```

## 4. Update Plan

`POST - /update_internal_audit`

### Request

The request contains `internal_audit_id` plus all fields from the create request.

```ts
{
  internal_audit_id: 12,
  audit_start_date: "2026-10-04",
  audit_end_date: "2026-10-05",
  project_id: 1,
  full_company: false,
  audit_standern_id: 1,
  audit_team: [],
  audit_scope: [],
  audit_schedule: [],
  is_draft: true
}
```

### Response

```ts
{
  status: true,
  message: "Internal audit updated successfully"
}
```

Test mode returns `InternalAuditPlanModel.example`.

## 5. Delete Plan

`POST - /delete_internal_audit`

### Request

```ts
{
  internal_audit_id: number
}
```

### Response

```ts
{
  status: true,
  message: "Internal audit deleted successfully"
}
```

Test mode returns `InternalAuditPlanModel.example`.

## Test Model Example

```ts
{
  id: 12,
  title: "IA-2026-0012",
  auditStartDate: "2026-10-04",
  auditEndDate: "2026-10-04",
  status: "planned",
  project: { id: 1, title: "Central Operations Project" },
  fullCompany: false,
  auditStandard: { id: 1, title: "ISO 45001:2018" },
  auditTeam: [
    { employee: { id: 101, name: "Sara Ibrahim" }, is_lead_auditor: true },
    { employee: { id: 102, name: "Ahmed Hassan" }, is_lead_auditor: false }
  ],
  auditScope: [
    { department: { id: 22, title: "Maintenance" }, activities: [] }
  ],
  auditSchedule: [
    {
      start_time: "09:00",
      end_time: "12:00",
      day: "2026-10-04",
      location: "Maintenance Workshop"
    }
  ],
  serial_name: "IA-2026-0012",
  serial_number: "0012"
}
```
