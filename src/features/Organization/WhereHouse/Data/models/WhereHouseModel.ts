import TitleInterface from '@/base/Data/Models/title_interface'

export default class WhereHouseModel extends TitleInterface {
  public SerialNumber: string

  constructor(id: number, name: string, SerialNumber: string) {
    super({ id: id, title: name })
    this.SerialNumber = SerialNumber
  }

  static fromMap(data: any): WhereHouseModel {
    return new WhereHouseModel(data.id, data.name, data.serial_number)
  }

  static example: WhereHouseModel[] = [
    new WhereHouseModel(10, 'New House 1', '10'),
    new WhereHouseModel(10, 'New House 2', '10'),
    new WhereHouseModel(10, 'New House 3', '10'),
    new WhereHouseModel(10, 'New House 4', '10'),
    new WhereHouseModel(10, 'New House 5', '10'),
  ]
}
