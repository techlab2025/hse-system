import LeadershipVisitImprovementModel from './LeadershipVisitImprovementModel'

export default class LeadershipVisitReportModel {
  constructor(
    public id: number,
    public topic: string,
    public discussion: string,
    public observations: string,
    public improvements: LeadershipVisitImprovementModel[],
    public attachments: string[],
  ) {}

  static fromMap(data: any): LeadershipVisitReportModel {
    return new LeadershipVisitReportModel(
      Number(data?.id ?? data?.report_id ?? 0),
      data?.topic ?? '',
      data?.discussion ?? '',
      data?.observations ?? '',
      data?.improvements?.map((item: any) => LeadershipVisitImprovementModel.fromMap(item)) ?? [],
      data?.attachments ?? [],
    )
  }
}
