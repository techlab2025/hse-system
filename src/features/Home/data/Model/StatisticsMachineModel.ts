export default class StatisticsMachineModel {
  public id: number
  public type: number
  public months:{month: number, number: number}[]
  constructor(id: number, type: number, months: {month: number, number: number}[]) {
    this.id = id
    this.type = type
    this.months = months
  }

  static fromMap(data: any): StatisticsMachineModel {
    return new StatisticsMachineModel(data.id, data.type, data.months)
  }
  static example: StatisticsMachineModel = new StatisticsMachineModel(1, 1, 200)
}
