import TitleInterface from '@/base/Data/Models/title_interface'
import WhereHouseTypeDetailsModel from '@/features/Organization/WhereHouseType/Data/models/WhereHouseTypeDetailsModel'

export default class WhereHouseDetailsModel {
  public id: number
  public name: string
  public SerialNumber: string
  public warehouse_type: WhereHouseTypeDetailsModel

  constructor(
    id: number,
    name: string,
    SerialNumber: string,
    warehouse_type: WhereHouseTypeDetailsModel,
  ) {
    this.id = id
    this.name = name
    this.SerialNumber = SerialNumber
    this.warehouse_type = warehouse_type
  }

  static fromMap(data: any): WhereHouseDetailsModel {
    return new WhereHouseDetailsModel(
      data.id,
      data.name,
      data.serial_number,
      this.getTitle(data?.warehouse_type),
    )
  }

  static example: WhereHouseDetailsModel = new WhereHouseDetailsModel(1, 'test', 'test')
  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new WhereHouseTypeDetailsModel(
      data.id,
      data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    )
  }
}
