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
    public hasReport: boolean ,
  ) {}

  static fromMap(data: Record<string, any>): LeadershipVisitModel {
    return new LeadershipVisitModel(
      Number(data.id ?? data.visit_id ?? 0),

      Number(data.leadership_engagement_id ?? 0),

      String(data.date ?? ''),

      String(data.location ?? ''),

      Number(data.status ?? 0),

      data.creatable ? LeadershipVisitCreatableModel.fromMap(data.creatable) : null,

      Array.isArray(data.activities)
        ? data.activities.map((item) => LeadershipVisitActivityModel.fromMap(item))
        : [],

      Array.isArray(data.employees)
        ? data.employees.map((item) => LeadershipVisitEmployeeModel.fromMap(item))
        : [],
      data.has_report,
    )
  }
}
