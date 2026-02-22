export default class StatisticsMachineModel {
  public zoon: string
  public statics: { type: number; value: number }[]
  constructor(zoon: string, statics: { type: number; value: number }[]) {
    this.zoon = zoon
    this.statics = statics
  }

  static fromMap(data: any): StatisticsMachineModel {
    return new StatisticsMachineModel(data.zoon, data.statics)
  }

  static example: StatisticsMachineModel[] = [
    new StatisticsMachineModel('Zoon1', [
      { type: 1, value: 10 },
      { type: 2, value: 20 },
      { type: 3, value: 30 },
    ]),
    new StatisticsMachineModel('Zoon2', [
      { type: 1, value: 30 },
      { type: 2, value: 15 },
    ]),
    new StatisticsMachineModel('Zoon3', [
      { type: 1, value: 50 },
      { type: 2, value: 40 },
    ]),
  ]
}
