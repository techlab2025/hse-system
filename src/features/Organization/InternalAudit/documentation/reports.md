# Internal Audit Reports

## Report Details Model

```ts
type InternalAuditPlanReportDetailsModel = {
  id: number
  auditNumber: string
  auditStartDate: string
  auditEndDate: string
  internalAuditors: Array<{
    id: number
    name: string
  }>
  purpose: string
}
```

## 1. Fetch Plan Details for Report

`POST - /fetch_internal_audit_plan_details`

### Request

```ts
{
  internal_audit_plan_id: number
}
```

### Response

Preferred response shape:

```ts
{
  status: true,
  message: "Internal audit plan details fetched successfully",
  data: {
    id: 12,
    audit_number: "IA-2026-0012",
    audit_start_date: "2026-10-04",
    audit_end_date: "2026-10-04",
    internal_auditors: [
      { id: 101, name: "Sara Ibrahim" },
      { id: 102, name: "Ahmed Hassan" }
    ],
    purpose: "To evaluate implementation of the occupational health and safety management system against ISO 45001:2018 within the agreed audit scope."
  }
}
```

## 2. Create Report

`POST - /create_internal_audit_report`

### Request Model

```ts
type CreateInternalAuditReportRequest = {
  internal_audit_id: number
  scopr: string
  methodology: string
  maintenance: string
  general_observations: string
  conclusion: string
  report_attachments: string[] // Base64 file strings
}
```
### Request Example

```ts
{
  internal_audit_id: 12,
  scopr: "Maintenance: Workplace inspection, Calibration records",
  methodology: "The audit used interviews, record review, observation, and sampling.",
  maintenance: "Maintenance records were sampled against the approved procedure.",
  general_observations: "The team cooperated and supplied the requested evidence.",
  conclusion: "The audit was completed and identified one open action for follow-up.",
  report_attachments: ["JVBERi0xLjQ..."]
}
```

### Response

Production and development expect a message-only success response:

```ts
{
  status: true,
  message: "Internal audit report created successfully"
}
```

## Test Model Example

```ts
{
  id: 12,
  auditNumber: "IA-2026-0012",
  auditStartDate: "2026-10-04",
  auditEndDate: "2026-10-04",
  internalAuditors: [
    { id: 101, name: "Sara Ibrahim" },
    { id: 102, name: "Ahmed Hassan" }
  ],
  purpose: "To evaluate implementation of the occupational health and safety management system against ISO 45001:2018 within the agreed audit scope."
}
```

