# Internal Audit Attendance


## Response Model

```ts
type InternalAuditAttendanceModel = {
  id: number
  orgEmployeeId: number // response key: org_emploee_id
  employee: { id: number; name: string }
  pisition: { id: number; title: string } | null
  department: { id: number; title: string } | null
  openMeeting: boolean
  closeMeeting: boolean
  isParticipant: boolean
  isLead: boolean
}
```

## 1. Fetch Attendance

`POST - /fetch_internal_audit_attendance`

This endpoint and its empty request remain unchanged.

### Request

```ts
{
}
```

### Response

```ts
{
  status: true,
  message: "Attendance fetched successfully",
  data: [
    {
      id: 1,
      org_emploee_id: 101,
      employee: { id: 101, name: "Sara Ibrahim" },
      pisition: { id: 11, title: "HSE Manager" },
      department: { id: 21, title: "Health and Safety" },
      open_meeting: true,
      close_meeting: true,
      is_participant: false,
      is_lead: true
    },
    {
      id: 2,
      org_emploee_id: 103,
      employee: { id: 103, name: "Mona Ali" },
      pisition: { id: 13, title: "Quality Specialist" },
      department: { id: 23, title: "Quality" },
      open_meeting: false,
      close_meeting: false,
      is_participant: true,
      is_lead: false
    }
  ]
}
```

## 2. Save Attendance

`POST - /save_internal_audit_attendance`

One object is sent for every row returned by the attendance fetch, including audit-team employees and participants.

### Request

```ts
{
  employees: [
    {
      org_emploee_id: 101,
      open_meeting: true,
      close_meeting: false,
    },
    {
      org_emploee_id: 103,
      open_meeting: false,
      close_meeting: true,
    },
  ]
}
```

### Response

```ts
{
  status: true,
  message: "Attendance saved successfully"
}
```

## 3. Add Internal Audit Participants

`POST - /add_internal_audit_Participants`

### Request

The `emolpoyees` spelling is intentionally preserved from the backend contract.

```ts
{
  emolpoyees: [{ employee_id: 103 }, { employee_id: 104 }]
}
```

### Response

```ts
{
  status: true,
  message: "Participants added successfully"
}
```
