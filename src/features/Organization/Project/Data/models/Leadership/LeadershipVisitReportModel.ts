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

  static fromMap(data: unknown): LeadershipVisitReportModel {
    const source: Record<string, unknown> =
      data && typeof data === 'object' ? (data as Record<string, unknown>) : {}
    const improvements = source.improvements ?? source.areas_of_improvement
    const attachments = source.attachments ?? source.media

    return new LeadershipVisitReportModel(
      Number(source.id ?? source.report_id ?? 0),
      String(source.topic ?? ''),
      String(source.discussion ?? ''),
      String(source.observations ?? ''),
      Array.isArray(improvements)
        ? improvements.map((item) => LeadershipVisitImprovementModel.fromMap(item))
        : [],
      Array.isArray(attachments)
        ? attachments
            .map((attachment) => {
              if (typeof attachment === 'string') return attachment
              if (!attachment || typeof attachment !== 'object') return ''
              const item = attachment as Record<string, unknown>
              return String(item.url ?? item.file ?? item.path ?? '')
            })
            .filter(Boolean)
        : [],
    )
  }
}
