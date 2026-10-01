import type InvestegationDocumentMedaModel from '@/features/Organization/Investigating/Data/models/InvestegationDocumentMedaModel'
import LeadershipVisitReportImprovementModel from './LeadershipVisitReportImprovementModel'

export default class LeadershipVisitDetailsModel {
  constructor(
    public id: number,
    public visitId: number,
    public serial: string | null,
    public serialNumber: string | null,
    public date: string,
    public status: number | null,
    public engagementTopic: string | null,
    public engagementDiscussion: string | null,
    public positiveObservations: string | null,
    public areasOfImprovement: LeadershipVisitReportImprovementModel[],
    public createdAt: string,
    public updatedAt: string,
    public media: string[] = []
    //  public media: InvestegationDocumentMedaModel[]
  ) {}

  static fromMap(data: Record<string, unknown>): LeadershipVisitDetailsModel {
    return new LeadershipVisitDetailsModel(
      Number(data.id ?? 0),
      Number(data.visit_id ?? 0),
      typeof data.serial === 'string' ? data.serial : null,
      typeof data.serial_number === 'string' ? data.serial_number : null,
      String(data.date ?? ''),
      data.status === null || data.status === undefined ? null : Number(data.status),
      typeof data.engagement_topic === 'string' ? data.engagement_topic : null,
      typeof data.engagement_discussion === 'string' ? data.engagement_discussion : null,
      typeof data.positive_observations === 'string' ? data.positive_observations : null,
      Array.isArray(data.areas_of_improvement)
        ? data.areas_of_improvement.map((item) =>
            LeadershipVisitReportImprovementModel.fromMap(item as Record<string, unknown>),
          )
        : [],
      String(data.created_at ?? ''),
      String(data.updated_at ?? ''),
      Array.isArray(data.media)
        ? data.media.flatMap((item) => {
            if (typeof item === 'string') return [item]
            if (!item || typeof item !== 'object') return []
            const url = (item as Record<string, unknown>).url
            return typeof url === 'string' && url ? [url] : []
          })
        : [],
    )
  }
}
