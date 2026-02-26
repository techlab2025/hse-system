export default class HazardObservationModel {
  public hazard_id: number
  public hazard_title: string
  public count: number

  constructor(hazard_id: number, hazard_title: string, count: number) {
    this.hazard_id = hazard_id
    this.hazard_title = hazard_title
    this.count = count
  }

  static fromMap(data: any): HazardObservationModel {
    return new HazardObservationModel(
      data.hazard_id,
      data.hazard_title,
      data.count,
    )
  }
}
