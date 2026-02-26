import SingleStaticsModel from './SingleStaticsModel'

export default class StatisticsMachineModel {
  public zoon: string
  public statics: SingleStaticsModel[]
  public total_equipments: number
  constructor(zoon: string, total_equipments: number, statics: SingleStaticsModel[]) {
    this.zoon = zoon
    this.statics = statics
    this.total_equipments = total_equipments
  }

  static fromMap(data: any): StatisticsMachineModel {
    return new StatisticsMachineModel(
      data.title,
      data.total_equipments,
      data.equipment_types.map((item: any) => SingleStaticsModel.fromMap(item)),
    )
  }

  static example: StatisticsMachineModel[] = [
    new StatisticsMachineModel('Zoon1', 100, [
      SingleStaticsModel.example,
      SingleStaticsModel.example,
      SingleStaticsModel.example,
    ]),
    new StatisticsMachineModel('Zoon2', 100, [SingleStaticsModel.example, { type: 2, value: 15 }]),
    new StatisticsMachineModel('Zoon3', [
      { type: 1, value: 50 },
      { type: 2, value: 40 },
    ]),
  ]
}
