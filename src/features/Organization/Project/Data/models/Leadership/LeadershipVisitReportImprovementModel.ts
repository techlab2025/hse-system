import TitleInterface from '@/base/Data/Models/title_interface'

export default class LeadershipVisitReportImprovementModel {
  constructor(
    public id: number,
    public visitReportId: number,
    public areaForImprovement: string | null,
    public interventionCarriedOut: string | null,
    public uaUc: number | null,
    public leadershipTheme: TitleInterface | null,
    public leadershipCategory: TitleInterface | null,
    public createdAt: string,
    public updatedAt: string,
  ) {}

  static fromMap(data: Record<string, unknown>): LeadershipVisitReportImprovementModel {
    const theme = data.leadership_theme
    const category = data.leadership_category

    return new LeadershipVisitReportImprovementModel(
      Number(data.id ?? 0),
      Number(data.visit_report_id ?? 0),
      typeof data.area_for_improvement === 'string' ? data.area_for_improvement : null,
      typeof data.intervention_carried_out === 'string' ? data.intervention_carried_out : null,
      data.ua_uc === null || data.ua_uc === undefined ? null : Number(data.ua_uc),
      theme && typeof theme === 'object'
        ? new TitleInterface({
            id: Number((theme as Record<string, unknown>).id ?? 0),
            title: String((theme as Record<string, unknown>).title ?? ''),
          })
        : null,
      category && typeof category === 'object'
        ? new TitleInterface({
            id: Number((category as Record<string, unknown>).id ?? 0),
            title: String((category as Record<string, unknown>).title ?? ''),
          })
        : null,
      String(data.created_at ?? ''),
      String(data.updated_at ?? ''),
    )
  }
}
