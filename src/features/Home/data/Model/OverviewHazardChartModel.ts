export default class OverviewHazardChartModel {
  public total: number
  public active: number
  public inactive: number
  public expired: number

  constructor(total: number, active: number, inactive: number, expired: number) {
    this.total = total
    this.active = active
    this.inactive = inactive
    this.expired = expired
  }

  static fromMap(data: any): OverviewHazardChartModel {
    return new OverviewHazardChartModel(
      data.total,
      data.active,
      data.inactive,
      data.expired,
    )
  }
}
