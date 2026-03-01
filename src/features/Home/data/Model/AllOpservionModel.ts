export default class AllOpservionModel {
  public hazard: number
  public accidents: number
  public observation: number

  constructor(hazard: number, accidents: number, observation: number) {
    this.hazard = hazard
    this.accidents = accidents
    this.observation = observation
  }

  static fromMap(data: any): AllOpservionModel {
    return new AllOpservionModel(
      data.hazard,
      data.accidents,
      data.observation,
    )
  }
}
