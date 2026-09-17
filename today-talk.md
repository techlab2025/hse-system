# Today Talk APIs

## Get Today Talk

**Endpoint**

`POST /api/get_today_talks`

### Request

```json
{
  "project_id?": number,
  "is_assigned_to_project?": boolean
}
```

### Response

```json
{
  "id": 1,
  "project_id": 1,
  "content": "Today's discussion",
  "time": "10:30",
  "date": "2026-08-04",
  "employees": [
    {
      "id": 1,
      "organization_employee_id": 12,
      "is_attend": true
    }
  ]
}
```

---

## Create Today Talk

**Endpoint**

`POST /api/create_today_talk`

### Request

```json
{
  "project_id"?: number,
  "content": "Today's discussion",
  "employees": [
    {
      "organization_employee_id": 12,
      "is_attend": true
    },
    {
      "organization_employee_id": 15,
      "is_attend": false
    }
  ],
  "date":string,
  "time":string
}
```

## Create Today Talk answer

**Endpoint**

`POST /api/create_today_talk_answer`

### Request

```json
{
  "project_id"?: number,
  "content": "Today's discussion",
  "employees": [
    {
      "organization_employee_id": 12,
      "is_attend": true
    },
    {
      "organization_employee_id": 15,
      "is_attend": false
    }
  ],
  "date":string,
  "time":string
}
```
