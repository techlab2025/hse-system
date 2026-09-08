# Project Steps Documentation

## Enums

```ts
export enum HolidayDaysEnum {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export enum projectProgressStatusEnum {
  BASIC_DATA = 1,
  BASIC_DATA_AND_HOLIDAYS = 2,
  BASIC_DATA_AND_HOLIDAYS_AND_POSITIONS_AND_EMPLOYEES = 3,
  BASIC_DATA_AND_HOLIDAYS_AND_POSITIONS_AND_EMPLOYEES_AND_TEAMS = 4,
  BASIC_DATA_AND_HOLIDAYS_AND_POSITIONS_AND_EMPLOYEES_AND_TEAMS_AND_EQUIPMENT = 5,
}
```

---

# Step 1

`POST - /create_basic_project`

## Request

```ts
{
  "translation": TranslationsParams{
    "description_en/ar/any":string,
    "title_en/ar/any":string
  },
  "contractors":[
    {
        "contractor_id":number
    }
  ],
  "locations":[
    {
        "location_id":number
    }
  ],
  "zoons":[
    {
        "zoon_id":number
    }
  ],
  "serial"?:string,
  "start_date":string,
  "end_date":string,
  "cost":string,
  "has_zoon":boolean

}
```

## Response

```ts
{
  "project_status":projectProgressStatusEnum,
  "project_progress":number
}
```

---

# Step 2

`POST - /create_project_holidays`

## Request

```ts
{
  "basic_holiday_days": HolidayDaysEnum[],
  "has_custom_holiday_days":boolean,
  "custom_holiday_days":[
    {
        "holiday_title":string,
        "holidays_dates":string[]
    }
  ]

}
```

## Response

```ts
{
  "project_status":PrijectStutsEnum,
  "project_progress":number
}
```

---

# Step 3

`POST - /create_project_location_position_employees`

## Request

```ts
{
  [
    "project_location_id":number,
    "hierarchies":[
        {
            "hierarchy_id":number,
            "organization_employees":[
                {
                    "organization_employee_id":number
                }
            ]
        }
    ]
  ]


}
```

## Response

```ts
{
  "project_status":PrijectStutsEnum,
  "project_progress":number
}
```

---

# Step 4

`POST - /create_project_teams`

## Request

```ts
{
  [
    "project_location_id":number,
    "project_teams":[
        {
            "team_id":number,
            "organization_employees":[
                {
                    "organization_employee_id":number
                }
            ]
        }
    ]
  ]


}
```

## Response

```ts
{
  "project_status":PrijectStutsEnum,
  "project_progress":number
}
```

---

# Step 5

`POST - /create_project_equipments`

## Request

```ts
{
  [
    "project_zoon_id":number,
    "equipments":[
        {
            "equipment_id":number,
        }
    ]
  ]


}
```

## Response

```ts
{
  "project_status":PrijectStutsEnum,
  "project_progress":number
}
```

---

#

## All Endpoinsts have update endpoint with "project_id" key


# project details updates

`POST - /fetch_project_details`

## Request

```ts
{
  "incident_type_matrix"


}
```

## Response

```ts
{
  "project_status":PrijectStutsEnum,
  "project_progress":number
}
```

---
