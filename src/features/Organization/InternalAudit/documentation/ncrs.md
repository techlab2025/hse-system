# Internal Audit NCRs

## Enums

```ts
enum NcrCategoryEnum {
  MINOR_NC = 1,
  MAJOR_NC = 2,
}

enum StatusEnum {
  PENDING = 'pending',
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}
```

## List Response Model

```ts
type InternalAuditNcrModel = {
  id: number
  ncr: string
  ncrsCategory: 1 | 2 | number | string
  area: string
  createdBy: { id: number; name: string }
  createdAt: string
  auditee: { id: number; name: string }
  dueDate: string
  status: StatusEnum
  leadReview: { id: number; name: string }
  leadReviewStatus: string
  serial_name: string
  serial_number: string
}
```

## 1. Fetch NCRs

`POST - /fetch_ncrs`

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
  word: "NCR-2026",
  paginate: 1,
  page: 1,
  limit: 10
}
```

### Response

```ts
{
  status: true,
  message: "NCRs fetched successfully",
  data: {
    data: [
      {
        id: 1,
        ncr: "NCR-2026-001",
        ncrs_category: 1,
        area_under_reviews: [
          {
            area_under_review_id: 616,
            area_under_review: { id: 616, title: "qqqqqqqqq" }
          },
          {
            area_under_review_id: 713,
            area_under_review: { id: 713, title: "Position Name 12" }
          }
        ],
        created_by: { id: 101, name: "Sara Ibrahim" },
        created_at: "2026-10-04T13:15:20.000000Z",
        auditee: { id: 104, name: "Mona Adel" },
        due_date: "2026-10-18",
        status: "open",
        lead_review: { id: 102, name: "Ahmed Hassan" },
        lead_review_status: "Pending",
        serial_name: "NCR-2026-001",
        serial_number: "001"
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

## 2. Create NCR

`POST - /create_ncrs`

### Request Model

```ts
type CreateNcrRequest = {
  ncrs_category: 1 | 2
  area_under_reviews: Array<{
    area_under_review_id: number
  }>
  audit_standard_id: number
  rquiriment_refrence: string
  description: string
  immediate_action: string
  root_causes: Array<{
    root_causes_id: number
  }>
  internal_audit_tasks: Array<{
    correcive_action: {
      correction: string
      assgined_to_id: number
      target_date: string
      actual_date: string
    }
    preventive_action: {
      preventive: string
      assgined_to_id: number
      target_date: string
      actual_date: string
    }
  }>
  attachments: string[] // Base64 file strings
  internal_audit_id: number
  is_draft: false
}
```

### Request Example

```ts
{
  ncrs_category: 1,
  area_under_reviews: [
    { area_under_review_id: 616 },
    { area_under_review_id: 713 }
  ],
  audit_standard_id: 1,
  rquiriment_refrence: "ISO 45001:2018 - 8.1",
  description: "Maintenance calibration records were incomplete.",
  immediate_action: "Missing records were collected and isolated for review.",
  root_causes: [
    { root_causes_id: 3 },
    { root_causes_id: 7 }
  ],
  internal_audit_tasks: [
    {
      correcive_action: {
        correction: "Complete and validate all calibration records.",
        assgined_to_id: 104,
        target_date: "2026-10-18",
        actual_date: ""
      },
      preventive_action: {
        preventive: "Add a monthly calibration-record review.",
        assgined_to_id: 102,
        target_date: "2026-10-25",
        actual_date: ""
      }
    }
  ],
  attachments: ["JVBERi0xLjQ..."],
  internal_audit_id: 12,
  is_draft: false
}
```

The form fetches `/fetch_internal_audit_details` using the audit ID from the route. Its `serial_name` is displayed as a disabled field, and only the departments from `audit_scope` are available in the Area under review multi-select. Audit standards are loaded with `IndexAuditStandardController` and `IndexAuditStandardParams`.

The NCR table also uses the `auditee` returned by `/fetch_internal_audit_details`. If audit details do not include an auditee, it falls back to the NCR row's `auditee` value.

### Response

Production and development expect a message-only success response:

```ts
{
  status: true,
  message: "NCR created successfully"
}
```

Test mode returns the first `InternalAuditNcrModel.example` item.

## Test Model Example

```ts
;[
  {
    id: 1,
    ncr: 'NCR-2026-001',
    ncrsCategory: 1,
    area: 'Maintenance Workshop',
    createdBy: { id: 101, name: 'Sara Ibrahim' },
    createdAt: '2026-10-04T13:15:20.000000Z',
    auditee: { id: 104, name: 'Mona Adel' },
    dueDate: '2026-10-18',
    status: 'open',
    leadReview: { id: 102, name: 'Ahmed Hassan' },
    leadReviewStatus: 'Pending',
    serial_name: 'NCR-2026-001',
    serial_number: '001',
  },
  {
    id: 2,
    ncr: 'NCR-2026-002',
    ncrsCategory: 2,
    area: 'Calibration Records',
    createdBy: { id: 103, name: 'Mona Ali' },
    createdAt: '2026-10-05T09:30:00.000000Z',
    auditee: { id: 105, name: 'Omar Khaled' },
    dueDate: '2026-10-22',
    status: 'in_progress',
    leadReview: { id: 101, name: 'Sara Ibrahim' },
    leadReviewStatus: 'Reviewed',
    serial_name: 'NCR-2026-002',
    serial_number: '002',
  },
]
```
