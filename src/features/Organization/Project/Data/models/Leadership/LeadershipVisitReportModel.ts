import TitleInterface from '@/base/Data/Models/title_interface'

type DataMap = Record<string, unknown>

const asMap = (value: unknown): DataMap =>
  value && typeof value === 'object' ? (value as DataMap) : {}

export class LeadershipVisitImprovementModel {
  constructor(
    public id: number,
    public areas: string,
    public interventionCarriedOut: string,
    public uaUc: string,
    public visitTheme: TitleInterface | null,
    public visitCategory: TitleInterface | null,
  ) {}

  static fromMap(data: DataMap): LeadershipVisitImprovementModel {
    return new LeadershipVisitImprovementModel(
      Number(data.id ?? 0),
      String(data.areas ?? data.area ?? ''),
      String(data.intervention_carried_out ?? data.interventionCarriedOut ?? ''),
      String(data.ua_uc ?? data.uaUc ?? ''),
      LeadershipVisitReportModel.toTitle(data.visit_theme ?? data.visit_them),
      LeadershipVisitReportModel.toTitle(data.visit_category),
    )
  }
}

export default class LeadershipVisitReportModel {
  constructor(
    public id: number,
    public topic: string,
    public discussion: string,
    public observations: string,
    public improvements: LeadershipVisitImprovementModel[],
    public attachments: string[],
  ) {}

  static toTitle(value: unknown): TitleInterface | null {
    if (!value || typeof value !== 'object') return null
    if (value instanceof TitleInterface) return value
    const data = asMap(value)
    return new TitleInterface({
      id: Number(data.id ?? 0),
      title: String(data.title ?? data.name ?? ''),
    })
  }

  static fromMap(data: DataMap): LeadershipVisitReportModel {
    const improvements = Array.isArray(data.improvements)
      ? data.improvements.map((item: unknown) =>
          LeadershipVisitImprovementModel.fromMap(asMap(item)),
        )
      : []
    const attachments = Array.isArray(data.attachments)
      ? data.attachments
          .map((item: unknown) => {
            if (typeof item === 'string') return item
            if (!item || typeof item !== 'object') return ''
            const attachment = asMap(item)
            return String(attachment.url ?? attachment.path ?? attachment.file ?? '')
          })
          .filter(Boolean)
      : []

    return new LeadershipVisitReportModel(
      Number(data.id ?? data.report_id ?? 0),
      String(data.topic ?? ''),
      String(data.discussion ?? ''),
      String(data.observations ?? ''),
      improvements,
      attachments,
    )
  }
}
