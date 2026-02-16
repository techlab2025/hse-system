export default class StatisticsMachineModel {
  public id: number
  public type: number
  public zoones: { zoon: number; number: number }[]
  constructor(id: number, type: number, months: { zoon: number; number: number }[]) {
    this.id = id
    this.type = type
    this.zoones = months
  }

  static fromMap(data: any): StatisticsMachineModel {
    return new StatisticsMachineModel(data.id, data.type, data.months)
  }
  static example: StatisticsMachineModel = new StatisticsMachineModel(1, 1, 200)
}
