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

  static fromMap(data: any): LeadershipVisitImprovementModel {
    return new LeadershipVisitImprovementModel(
      Number(data?.id ?? 0),
      data?.areas ?? data?.area ?? '',
      data?.intervention_carried_out ?? data?.interventionCarriedOut ?? '',
      data?.ua_uc ?? data?.uaUc ?? '',
      data?.visit_theme ?? data?.visit_them ?? null,
      data?.visit_category ?? null,
    )
  }
}
