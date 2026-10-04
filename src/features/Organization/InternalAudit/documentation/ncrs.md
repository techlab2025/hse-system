# Internal Audit NCRs

## Enums

```ts
enum NcrCategoryEnum {
  MINOR_NC = 1,
  MAJOR_NC = 2,
}

enum StatusEnum {
  PENDING = "pending",
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
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
  auditee: { id: number; name: string }
  dueDate: string
  status: StatusEnum
  leadReview: { id: number; name: string }
  leadReviewStatus: string
}
```

The model exposes `LeadReview` as an alias of `leadReview`. The mapper reads category from `ncrs_category`, `ncr_category`, or `category`; auditee from `auditee` or `audited_employee`; and lead review from `LeadReview` or `lead_review`.

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
        area: "Maintenance Workshop",
        created_by: { id: 101, name: "Sara Ibrahim" },
        auditee: { id: 104, name: "Mona Adel" },
        due_date: "2026-10-18",
        status: "open",
        lead_review: { id: 102, name: "Ahmed Hassan" },
        lead_review_status: "Pending"
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
  ncr_id: number
  ncrs_category: 1 | 2
  area_under_review_id: number
  audit_standard_id: number
  rquiriment_refrence: string
  description: string
  immediate_action: string
  capa: Array<{
    correcive_action: {
      correction: string
      root_causes: Array<{
        root_causes_id: number
      }>
      assgined_to_id: number
      target_date: string
      actual_date: string
    }
    preventive_action: {
      correction: string
      assgined_to_id: number
      target_date: string
      actual_date: string
    }
  }>
  attachments: string[] // Base64 file strings
}
```

### Request Example

```ts
{
  ncr_id: 12,
  ncrs_category: 1,
  area_under_review_id: 22,
  audit_standard_id: 1,
  rquiriment_refrence: "ISO 45001:2018 - 8.1",
  description: "Maintenance calibration records were incomplete.",
  immediate_action: "Missing records were collected and isolated for review.",
  capa: [
    {
      correcive_action: {
        correction: "Complete and validate all calibration records.",
        root_causes: [
          { root_causes_id: 3 },
          { root_causes_id: 7 }
        ],
        assgined_to_id: 104,
        target_date: "2026-10-18",
        actual_date: ""
      },
      preventive_action: {
        correction: "Add a monthly calibration-record review.",
        assgined_to_id: 102,
        target_date: "2026-10-25",
        actual_date: ""
      }
    }
  ],
  attachments: ["JVBERi0xLjQ..."]
}
```

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
[
  {
    id: 1,
    ncr: "NCR-2026-001",
    ncrsCategory: 1,
    area: "Maintenance Workshop",
    createdBy: { id: 101, name: "Sara Ibrahim" },
    auditee: { id: 104, name: "Mona Adel" },
    dueDate: "2026-10-18",
    status: "open",
    leadReview: { id: 102, name: "Ahmed Hassan" },
    leadReviewStatus: "Pending"
  },
  {
    id: 2,
    ncr: "NCR-2026-002",
    ncrsCategory: 2,
    area: "Calibration Records",
    createdBy: { id: 103, name: "Mona Ali" },
    auditee: { id: 105, name: "Omar Khaled" },
    dueDate: "2026-10-22",
    status: "in_progress",
    leadReview: { id: 101, name: "Sara Ibrahim" },
    leadReviewStatus: "Reviewed"
  }
]
```

