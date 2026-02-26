import StatisticsMachineModel from './StatisticsMachineModel'

export default class EquipmentStaticsModel {
  public rentEquipments: SingleStatic
  public statics: StatisticsMachineModel[]
  constructor(rentEquipments: SingleStatic, statics: StatisticsMachineModel[]) {
    this.rentEquipments = rentEquipments
    this.statics = statics
  }

  static fromMap(data: any): EquipmentStaticsModel {
    return new EquipmentStaticsModel(
      data.rent_and_owned_equipments,
      data.equipment_types_and_equipments_and_zones.map((item: any) =>
        StatisticsMachineModel.fromMap(item),
      ),
    )
  }

  // static example: EquipmentStaticsModel[] = [
  //   new EquipmentStaticsModel('Zoon1', [
  //     { type: 1, value: 10 },
  //     { type: 2, value: 20 },
  //     { type: 3, value: 30 },
  //   ]),
  //   new EquipmentStaticsModel('Zoon2', [
  //     { type: 1, value: 30 },
  //     { type: 2, value: 15 },
  //   ]),
  //   new EquipmentStaticsModel('Zoon3', [
  //     { type: 1, value: 50 },
  //     { type: 2, value: 40 },
  //   ]),
  // ]
  static example: EquipmentStaticsModel = new EquipmentStaticsModel(
    { rent: 10, owned: 20 },
    [
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
    ],
  )
}

interface SingleStatic {
  rent: number
  owned: number
}
