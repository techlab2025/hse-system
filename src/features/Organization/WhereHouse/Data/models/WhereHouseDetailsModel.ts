export default class WhereHouseDetailsModel {
  public id: number
  public name: string
  public SerialNumber: string

  constructor(id: number, name: string, SerialNumber: string) {
    this.id = id
    this.name = name
    this.SerialNumber = SerialNumber
  }

  static fromMap(data: any): WhereHouseDetailsModel {
    return new WhereHouseDetailsModel(data.id, data.name, data.serial_number)
  }

  static example: WhereHouseDetailsModel = new WhereHouseDetailsModel(1, 'test', 'test')
}
