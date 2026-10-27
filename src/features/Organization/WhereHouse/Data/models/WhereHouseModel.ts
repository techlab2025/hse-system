import { localizedRecord } from '@/localization/records'
import TitleInterface from '@/base/Data/Models/title_interface'
import WhereHouseTypeModel from './WhereHouseTypeModel'

export default class WhereHouseModel extends TitleInterface {
  public SerialNumber: string
  public warehouse_type: WhereHouseTypeModel

  constructor(id: number, name: string, SerialNumber: string, warehouse_type: WhereHouseTypeModel) {
    super({ id: id, title: name })
    this.SerialNumber = SerialNumber
    this.warehouse_type = warehouse_type
  }

  static fromMap(data: any): WhereHouseModel {
    return localizedRecord(
      new WhereHouseModel(data.id, data.name, data.serial_number, data.warehouse_type),
      data,
    )
  }

  static example: WhereHouseModel[] = [
    new WhereHouseModel(10, 'New House 1', '10', WhereHouseTypeModel.example[0]),
    new WhereHouseModel(10, 'New House 2', '10', WhereHouseTypeModel.example[0]),
    new WhereHouseModel(10, 'New House 3', '10', WhereHouseTypeModel.example[0]),
    new WhereHouseModel(10, 'New House 4', '10', WhereHouseTypeModel.example[0]),
    new WhereHouseModel(10, 'New House 5', '10', WhereHouseTypeModel.example[0]),
  ]
}
