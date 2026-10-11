# Objectives Documentation

## Enums

```ts
export enum ObjectiveTargetTypeEnum {
  Percentage = 1,
  Number = 2,
  PeriodicFrequency = 3,
}

export enum ObjectiveDirectionEnum {
  Increase = 1,
  Reduce = 2,
}

export enum ObjectiveFrequencyEnum {
  Annually = 1,
  SemiAnnually = 2,
  Quarterly = 4,
  Monthly = 12,
}
```

---

## Routes

```ts
[
  "/organization/objectives",
  "/organization/objectives/project/:project_id",
  "/organization/objectives/project/:project_id/add",
  "/organization/objectives/project/:project_id/:id",
  "/organization/objectives/add",
  "/organization/objectives/:id"
]
```

---

# Step 1

`POST - /fetch_objectives`

## Request

```ts
{
  "word"?: string,
  "paginate": number,
  "page": number,
  "limit": number,
  "project_id"?: number
}
```

## Response

```ts
[
  {
    "id": number,
    "year": string,
    "objective": string,
    "project_title": string,
    "target_type": ObjectiveTargetTypeEnum | null,
    "direction": ObjectiveDirectionEnum | null,
    "target": number | null,
    "frequency": ObjectiveFrequencyEnum | null,
    "target_type_title": string,
    "direction_title": string,
    "frequency_title": string
  }
]
```

## Notes

```ts
{
  "project_id": "sent when page route is /organization/objectives/project/:project_id",
  "project_title": "if empty, UI displays Company-wide",
  "direction_title": "if empty, UI displays frequency_title or -"
}
```

---

# Step 2

`POST FormData - /fetch_objectives_details`

## Request

```ts
{
  "objective_id": number
}
```

## Response

```ts
{
  "id": number,
  "year": string,
  "objective": string,
  "project": TitleInterface | null,
  "target_type": ObjectiveTargetTypeEnum,
  "direction": ObjectiveDirectionEnum | null,
  "department": TitleInterface | null,
  "follow_up_employee": TitleInterface | null,
  "target": number | null,
  "baseline": number | null,
  "unit": string | null,
  "frequency": ObjectiveFrequencyEnum | null,
  "annual_occurrences": number | null
}
```

---

# Step 3

`POST - /create_objectives`

## Request

```ts
{
  "year": string,
  "objective": string,
  "target_type": ObjectiveTargetTypeEnum,
  "department_id": number,
  "follow_up_employee_id": number,
  "project_id"?: number,

  // sent when target_type is Percentage or Number
  "direction"?: ObjectiveDirectionEnum,
  "target"?: number,

  // sent when direction is Reduce
  "baseline"?: number,

  // sent when target_type is Number,
  // or target_type is Percentage and direction is Reduce
  "unit"?: string,

  // sent when target_type is PeriodicFrequency
  "frequency"?: ObjectiveFrequencyEnum,
  "annual_occurrences"?: number
}
```

## Required Fields

```ts
{
  "year": true,
  "objective": true,
  "target_type": true,
  "department_id": true,
  "follow_up_employee_id": true,
  "direction": "required unless target_type is PeriodicFrequency",
  "target": "required when target_type is Percentage or Number",
  "baseline": "required when direction is Reduce",
  "unit": "required when target_type is Number or Percentage Reduce",
  "frequency": "required when target_type is PeriodicFrequency"
}
```

## Request Examples

### Percentage Increase

```ts
{
  "year": "2026",
  "objective": "Train 80% of company employees in HSE.",
  "target_type": ObjectiveTargetTypeEnum.Percentage,
  "direction": ObjectiveDirectionEnum.Increase,
  "target": 80,
  "department_id": 5,
  "follow_up_employee_id": 12,
  "project_id": 433
}
```

### Number Reduce

```ts
{
  "year": "2026",
  "objective": "Reduce equipment incidents.",
  "target_type": ObjectiveTargetTypeEnum.Number,
  "direction": ObjectiveDirectionEnum.Reduce,
  "target": 20,
  "baseline": 100,
  "unit": "incident",
  "department_id": 5,
  "follow_up_employee_id": 12,
  "project_id": 433
}
```

### Periodic Frequency

```ts
{
  "year": "2026",
  "objective": "Run monthly safety drills.",
  "target_type": ObjectiveTargetTypeEnum.PeriodicFrequency,
  "frequency": ObjectiveFrequencyEnum.Monthly,
  "annual_occurrences": 12,
  "department_id": 5,
  "follow_up_employee_id": 12,
  "project_id": 433
}
```

## Response

```ts
{
  "id": number,
  "year": string,
  "objective": string,
  "project_title": string,
  "target_type": ObjectiveTargetTypeEnum | null,
  "direction": ObjectiveDirectionEnum | null,
  "target": number | null,
  "frequency": ObjectiveFrequencyEnum | null,
  "target_type_title": string,
  "direction_title": string,
  "frequency_title": string
}
```

---

# Step 4

`POST - /update_objectives`

## Request

```ts
{
  "objective_id": number,
  "year": string,
  "objective": string,
  "target_type": ObjectiveTargetTypeEnum,
  "department_id": number,
  "follow_up_employee_id": number,
  "project_id"?: number,

  // sent when target_type is Percentage or Number
  "direction"?: ObjectiveDirectionEnum,
  "target"?: number,

  // sent when direction is Reduce
  "baseline"?: number,

  // sent when target_type is Number,
  // or target_type is Percentage and direction is Reduce
  "unit"?: string,

  // sent when target_type is PeriodicFrequency
  "frequency"?: ObjectiveFrequencyEnum,
  "annual_occurrences"?: number
}
```

## Response

```ts
{
  "id": number,
  "year": string,
  "objective": string,
  "project_title": string,
  "target_type": ObjectiveTargetTypeEnum | null,
  "direction": ObjectiveDirectionEnum | null,
  "target": number | null,
  "frequency": ObjectiveFrequencyEnum | null,
  "target_type_title": string,
  "direction_title": string,
  "frequency_title": string
}
```

---

# Step 5

`POST FormData - /delete_objectives`

## Request

```ts
{
  "objective_id": number
}
```

## Response

```ts
{
  "id": number,
  "year": string,
  "objective": string,
  "project_title": string,
  "target_type": ObjectiveTargetTypeEnum | null,
  "direction": ObjectiveDirectionEnum | null,
  "target": number | null,
  "frequency": ObjectiveFrequencyEnum | null,
  "target_type_title": string,
  "direction_title": string,
  "frequency_title": string
}
```

---

# Step 6

`POST FormData - /change_objectives_active_status`

## Request

```ts
{
  "objective_id": number
}
```

## Response

```ts
{
  "message": string
}
```

## Notes

```ts
{
  "status": "service exists in objectives module, but it is not used by the current Objectives table UI"
}
```

---

# Form Selects

## Departments

`POST - /fetch_herikalys`

## Request

```ts
{
  "word"?: string,
  "paginate": number,
  "page": number,
  "limit": number,
  "return_patent_only": boolean,
  "project_id"?: number
}
```

---

## Follow-up Employees

`POST - /fetch_organization_employees`

## Request

```ts
{
  "word"?: string,
  "paginate": number,
  "page": number,
  "limit": number,
  "project_id"?: number
}
```

---

# Page Permissions

```ts
{
  "sidebar_and_page": [
    "ORGANIZATION_EMPLOYEE",
    "OBJECTIVE_ORG_ALL",
    "OBJECTIVE_ORG_FETCH",
    "OBJECTIVE_ORG_CREATE",
    "OBJECTIVE_ORG_UPDATE",
    "OBJECTIVE_ORG_DELETE"
  ],
  "create": [
    "ORGANIZATION_EMPLOYEE",
    "OBJECTIVE_ORG_CREATE"
  ],
  "update": [
    "ORGANIZATION_EMPLOYEE",
    "OBJECTIVE_ORG_UPDATE",
    "OBJECTIVE_ORG_ALL"
  ],
  "delete": [
    "ORGANIZATION_EMPLOYEE",
    "OBJECTIVE_ORG_DELETE",
    "OBJECTIVE_ORG_ALL"
  ]
}
```

---

# Front-end Flow

## List Page

```ts
{
  "component": "IndexObjectives.vue",
  "route": "/organization/objectives/project/:project_id",
  "controller": "IndexObjectivesController",
  "params": "IndexObjectivesParams",
  "search": "debounced by word",
  "pagination": "page and limit",
  "actions": ["add", "edit", "delete"]
}
```

## Add Page

```ts
{
  "component": "AddObjectives.vue",
  "form": "ObjectivesForm.vue",
  "controller": "AddObjectivesController",
  "params": "AddObjectivesParams",
  "save_redirect": "/organization/objectives/project/:project_id",
  "save_and_new": "keeps the user on the same page and resets the form"
}
```

## Edit Page

```ts
{
  "component": "EditObjectives.vue",
  "form": "ObjectivesForm.vue",
  "details_controller": "ShowObjectivesController",
  "update_controller": "EditObjectivesController",
  "details_params": "ShowObjectivesParams",
  "update_params": "EditObjectivesParams"
}
```

