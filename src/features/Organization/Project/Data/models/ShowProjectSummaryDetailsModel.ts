import ProjectAccidentTypeModel from './ProjectAccidentTypeModel'
import ProjectLossTimeModel from './ProjectLossTimeModel'

export default class ShowProjectSummaryDetailsModel {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly serialNumber: string,
    public readonly serialName: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly projectProgress: number,
    public readonly observationsCount: number,
    public readonly incidentsCount: number,
    public readonly investigationsCount: number,
    public readonly inspectionsCount: number,
    public readonly assignedEmployeesCount: number,
    public readonly equipmentCount: number,
    public readonly assignedLocationsCount: number,
    public readonly assignedZonesCount: number,
    public readonly teamsCount: number,
    public readonly positionsCount: number,
    public readonly contractorsCount: number,
    public readonly drillsCount: number,
    public readonly meetingsCount: number,
    public readonly meetingsWithResultsCount: number,
    public readonly lossTimes: ProjectLossTimeModel[],
    public readonly totalDrillCount:number
  ) {}

  static fromMap(data: Record<string, unknown>): ShowProjectSummaryDetailsModel {
    const lossTimes = Array.isArray(data.loss_times)
      ? data.loss_times
      : Array.isArray(data.total_loss_time_rates_stats)
        ? data.total_loss_time_rates_stats
        : []

    return new ShowProjectSummaryDetailsModel(
      Number(data.id ?? 0),
      String(data.title ?? ''),
      String(data.description ?? ''),
      String(data.serial_number ?? ''),
      String(data.serial_name ?? ''),
      String(data.start_date ?? ''),
      String(data.end_date ?? ''),
      Number(data.project_progress ?? 0),
      Number(data.observations_count ?? 0),
      Number(data.incidents_count ?? data.incident_count ?? 0),
      Number(data.investigations_count ?? data.investigation_count ?? 0),
      Number(data.inspections_count ?? data.inspection_count ?? 0),
      Number(data.assigned_employees_count ?? 0),
      Number(data.equipment_count ?? 0),
      Number(data.assigned_locations_count ?? 0),
      Number(data.assigned_zones_count ?? 0),
      Number(data.teams_count ?? 0),
      Number(data.positions_count ?? 0),
      Number(data.contractors_count ?? 0),
      Number(data.drills_count ?? 0),
      Number(data.meetings_count ?? 0),
      Number(data.meetings_with_results_count ?? 0),
      lossTimes.map((item) => ProjectLossTimeModel.fromMap(item as Record<string, unknown>)),
      Number(data.total_drill_count)
    )
  }

  static example = new ShowProjectSummaryDetailsModel(
    433,
    'New Capital Project',
    'Main construction and commissioning project.',
    'PRJ-433',
    '433',
    '2026-01-01',
    '2026-12-31',
    80,
    32,
    4,
    3,
    18,
    46,
    21,
    3,
    9,
    5,
    12,
    2,
    6,
    14,
    10,
    [
      new ProjectLossTimeModel(
        7,
        new ProjectAccidentTypeModel(7, 'Lost Time Injury'),
        0,
        2,
        8,
      ),
    ],
    10
  )
}
