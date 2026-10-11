# Project Summary Details Documentation


# Project Summary Endpoint

`POST - /fetch_project_summary_details`

## Request

```ts
{
  "project_id": number
}
```

## Response

```ts
{
  "id": number,
  "title": string,
  "description": string | null,
  "serial_number": string | null,
  "serial_name": string | null,
  "start_date": string | null,
  "end_date": string | null,
  "project_progress": number,

  // Safety statistics
  // observations_count includes normal observations and hazards.
  "observations_count": number,
  "incidents_count": number,
  "investigations_count": number,
  "inspections_count": number,

  // Operational statistics
  "assigned_employees_count": number,
  "equipment_count": number,
  "assigned_locations_count": number,
  "assigned_zones_count": number,
  "teams_count": number,
  "positions_count": number,
  "contractors_count": number,

  // Activity statistics
  "drills_count": number,
  "meetings_count": number,
  "meetings_with_results_count": number,

  // Required by the Loss Time Matrix displayed on the summary page.
  "loss_times": ProjectSummaryLossTime[]
}
```

## Loss Time Item

```ts
interface ProjectSummaryLossTime {
  accidents_type_id: number
  accidents_type: {
    id: number
    title: string
  }
  today_loss_time: number
  monthly_loss_time: number
  yearly_loss_time: number
}
```

## Frontend Model

```ts
interface ProjectSummaryLossTimeModel {
  accidentTypeId: number
  accidentType: {
    id: number
    title: string
  }
  dailyLossTime: number
  monthlyLossTime: number
  yearlyLossTime: number
}

export default class ProjectSummaryDetailsModel {
  id: number
  title: string
  description: string
  serialNumber: string
  serialName: string
  startDate: string
  endDate: string
  projectProgress: number

  observationsCount: number
  incidentsCount: number
  investigationsCount: number
  inspectionsCount: number

  assignedEmployeesCount: number
  equipmentCount: number
  assignedLocationsCount: number
  assignedZonesCount: number
  teamsCount: number
  positionsCount: number
  contractorsCount: number

  drillsCount: number
  meetingsCount: number
  meetingsWithResultsCount: number
  lossTimes: ProjectSummaryLossTimeModel[]
}
```

## Response Example

```json
{
  "id": 433,
  "title": "New Capital Project",
  "description": "Main construction and commissioning project.",
  "serial_number": "PRJ-433",
  "serial_name": "433",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "project_progress": 80,
  "observations_count": 32,
  "incidents_count": 4,
  "investigations_count": 3,
  "inspections_count": 18,
  "assigned_employees_count": 46,
  "equipment_count": 21,
  "assigned_locations_count": 3,
  "assigned_zones_count": 9,
  "teams_count": 5,
  "positions_count": 12,
  "contractors_count": 2,
  "drills_count": 6,
  "meetings_count": 14,
  "meetings_with_results_count": 10,
  "loss_times": [
    {
      "accidents_type_id": 7,
      "accidents_type": {
        "id": 7,
        "title": "Lost Time Injury"
      },
      "today_loss_time": 0,
      "monthly_loss_time": 2,
      "yearly_loss_time": 8
    }
  ]
}
```

---
