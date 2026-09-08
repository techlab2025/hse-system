# Project Steps Documentation

## Enums

```ts
export enum HolidayDaysEnum {
  SUNDAY = 1,
  MONDAY = 2,
  TUESDAY = 3,
  WEDNESDAY = 4,
  THURSDAY = 5,
  FRIDAY = 6,
  SATURDAY = 7,
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
  "contractor_ids":[
    {
        "contractor_id":number
    }
  ],
  "location_ids":[
    {
        "location_id":number
    }
  ],
  "zoon_ids":[
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
  "project_status":PrijectStutsEnum,
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
    "heirarchys":[
        {
            "heirarchy_id":number,
            "organizaion_employees":[
                {
                    "organizaion_employee_id":number
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
            "organizaion_employees":[
                {
                    "organizaion_employee_id":number
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