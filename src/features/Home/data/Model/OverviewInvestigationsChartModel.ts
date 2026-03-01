export default class OverviewInvestigationsChartModel {
  public zoneId: number
  public zoneTitle: string
  public total: number

  constructor(zoneId: number, zoneTitle: string, total: number) {
    this.zoneId = zoneId
    this.zoneTitle = zoneTitle
    this.total = total
  }

  static fromMap(data: any): OverviewInvestigationsChartModel {
    return new OverviewInvestigationsChartModel(
      data.zone_id,
      data.zone_title,
      data.total,
    )
  }
  static example(): OverviewInvestigationsChartModel {
    return new OverviewInvestigationsChartModel(
      1,
      "zone_title",
      1,
    )
  }
}
