import AllOpservionModel from "./AllOpservionModel"

export default class OverviewHazardChartModel {
  public zoneId: number
  public zoneTitle: string
  public allObservations: AllOpservionModel

  constructor(zoneId: number, zoneTitle: string, allObservations: AllOpservionModel) {
    this.zoneId = zoneId
    this.zoneTitle = zoneTitle
    this.allObservations = allObservations
  }

  static fromMap(data: any): OverviewHazardChartModel {
    return new OverviewHazardChartModel(
      data.zone_id,
      data.zone_title,
      data.all_observations,
    )
  }
  static example() {
    return {
      zone_id: 0,
      zone_title: "",
      all_observations: AllOpservionModel,
    }
  }
}
