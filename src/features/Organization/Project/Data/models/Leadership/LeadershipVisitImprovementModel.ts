import TitleInterface from '@/base/Data/Models/title_interface'

export default class LeadershipVisitImprovementModel {
  constructor(
    public id: number,
    public areas: string,
    public interventionCarriedOut: string,
    public uaUc: string,
    public visitTheme: TitleInterface | null,
    public visitCategory: TitleInterface | null,
  ) {}

  static fromMap(data: unknown): LeadershipVisitImprovementModel {
    const source: Record<string, unknown> =
      data && typeof data === 'object' ? (data as Record<string, unknown>) : {}

    return new LeadershipVisitImprovementModel(
      Number(source.id ?? 0),
      String(source.areas ?? source.area ?? source.areas_of_improvement ?? ''),
      String(source.intervention_carried_out ?? source.interventionCarriedOut ?? ''),
      String(source.ua_uc ?? source.uaUc ?? ''),
      LeadershipVisitImprovementModel.toTitle(
        source.visit_theme ?? source.visit_them ?? source.leadership_theme,
      ),
      LeadershipVisitImprovementModel.toTitle(source.visit_category ?? source.leadership_category),
    )
  }

  private static toTitle(value: unknown): TitleInterface | null {
    if (!value || typeof value !== 'object') return null
    const item = value as Record<string, unknown>
    return new TitleInterface({
      id: Number(item.id ?? 0),
      title: String(item.title ?? item.name ?? ''),
    })
  }
}
