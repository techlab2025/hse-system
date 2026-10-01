import LeadershipVisitReportModel from './LeadershipVisitReportModel'
import LeadershipVisitActivityModel from './LeadershipVisitActivityModel'
import LeadershipVisitCreatableModel from './LeadershipVisitCreatableModel'
import LeadershipVisitEmployeeModel from './LeadershipVisitEmployeeModel'

export default class LeadershipVisitModel {
  constructor(
    public id: number,
    public leadershipEngagementId: number,
    public date: string,
    public location: string,
    public status: number,

    public creatable: LeadershipVisitCreatableModel | null = null,

    public activities: LeadershipVisitActivityModel[] = [],

    public employees: LeadershipVisitEmployeeModel[] = [],

    public report: LeadershipVisitReportModel | null = null,

    public reportAdded = false,
    public hasReport = false,
  ) {}

  static fromMap(data: Record<string, unknown>): LeadershipVisitModel {
    const creatable = data.creatable
    const activities = data.activities
    const employees = data.employees
    const report = data.report

    return new LeadershipVisitModel(
      Number(data.id ?? data.visit_id ?? 0),

      Number(data.leadership_engagement_id ?? 0),

      String(data.date ?? ''),

      String(data.location ?? ''),

      Number(data.status ?? 0),

      creatable && typeof creatable === 'object'
        ? LeadershipVisitCreatableModel.fromMap(creatable as Record<string, unknown>)
        : null,

      Array.isArray(activities)
        ? activities.map((item) =>
            LeadershipVisitActivityModel.fromMap(item as Record<string, unknown>),
          )
        : [],

      Array.isArray(employees)
        ? employees.map((item) =>
            LeadershipVisitEmployeeModel.fromMap(item as Record<string, unknown>),
          )
        : [],
      report && typeof report === 'object' ? LeadershipVisitReportModel.fromMap(report) : null,
      Boolean(data.report_added ?? data.has_report ?? report),
      Boolean(data.has_report ?? data.report_added ?? report),
    )
  }
}
