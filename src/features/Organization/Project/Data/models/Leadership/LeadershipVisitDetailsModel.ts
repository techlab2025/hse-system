import LeadershipVisitActivityModel from './LeadershipVisitActivityModel'
import LeadershipVisitCreatableModel from './LeadershipVisitCreatableModel'
import LeadershipVisitEmployeeModel from './LeadershipVisitEmployeeModel'
import LeadershipVisitReportModel from './LeadershipVisitReportModel'

export default class LeadershipVisitDetailsModel {
  constructor(
    public id: number,
    public leadershipEngagementId: number,
    public date: string,
    public location: string,
    public status: number,
    public creatable: LeadershipVisitCreatableModel | null,
    public activities: LeadershipVisitActivityModel[],
    public employees: LeadershipVisitEmployeeModel[],
    public report: LeadershipVisitReportModel | null,
  ) {}

  static fromMap(data: Record<string, unknown>): LeadershipVisitDetailsModel {
    const report =
      data.report ??
      data.visit_report ??
      (data.topic || data.discussion || data.observations ? data : null)
    const activities = data.activities
    const employees = data.employees
    const creatable = data.creatable

    return new LeadershipVisitDetailsModel(
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
    )
  }
}


