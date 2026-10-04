# Internal Audit Attendance

Attendance is stored per employee row. Opening and closing meetings are separate boolean states; there is no single `attended` field.

## Enum

```ts
enum InternalAuditMeetingTypeEnum {
  OPENING = 1,
  CLOSING = 2,
}
```

## Response Model

```ts
type InternalAuditAttendanceModel = {
  id: number
  employee: { id: number; name: string }
  pisition: { id: number; title: string } | null
  department: { id: number; title: string } | null
  openMeeting: boolean
  closeMeeting: boolean
}
```

The model also exposes these aliases:

```ts
position      // returns pisition
open_meeting  // returns openMeeting
close_meeting // returns closeMeeting
```

The response mapper accepts the following backend aliases:

- ID: `id`, `internal_audit_attendance_id`, or `internal_audit_attendace_id`.
- Position: `pisition` or `position`.
- Opening: `open_meeting` or `open_meting`.
- Closing: `close_meeting` or `closing_meeting`.
- Booleans: `true`, `1`, `"1"`, `"true"`, and `"yes"` are treated as `true`.

## 1. Fetch Attendance

`POST - /fetch_internal_audit_attendance`

### Request

```ts
{}
```

### Response

```ts
{
  status: true,
  message: "Attendance fetched successfully",
  data: [
    {
      id: 1,
      employee: { id: 101, name: "Sara Ibrahim" },
      pisition: { id: 11, title: "HSE Manager" },
      department: { id: 21, title: "Health and Safety" },
      open_meeting: true,
      close_meeting: true
    },
    {
      id: 2,
      employee: { id: 102, name: "Ahmed Hassan" },
      pisition: { id: 12, title: "Maintenance Engineer" },
      department: { id: 22, title: "Maintenance" },
      open_meeting: true,
      close_meeting: false
    }
  ]
}
```

## 2. Change Meeting Status

`POST - /change_internal_audit_attendance_status`

The clicked row supplies its attendance ID. The clicked switch determines `meeting_type`; only that row and meeting status are toggled.

### Request

Opening meeting:

```ts
{
  internal_audit_attendace_id: 2,
  meeting_type: 1
}
```

Closing meeting:

```ts
{
  internal_audit_attendace_id: 2,
  meeting_type: 2
}
```

### Response

Production and development expect a message-only success response:

```ts
{
  status: true,
  message: "Attendance status changed successfully"
}
```

Test mode returns the first `InternalAuditAttendanceModel.example` row.

## Test Model Example

```ts
[
  {
    id: 1,
    employee: { id: 101, name: "Sara Ibrahim" },
    pisition: { id: 11, title: "HSE Manager" },
    department: { id: 21, title: "Health and Safety" },
    openMeeting: true,
    closeMeeting: true
  },
  {
    id: 2,
    employee: { id: 102, name: "Ahmed Hassan" },
    pisition: { id: 12, title: "Maintenance Engineer" },
    department: { id: 22, title: "Maintenance" },
    openMeeting: true,
    closeMeeting: false
  },
  {
    id: 3,
    employee: { id: 103, name: "Mona Ali" },
    pisition: { id: 13, title: "Quality Specialist" },
    department: { id: 23, title: "Quality" },
    openMeeting: false,
    closeMeeting: false
  }
]
```

