
export default class WhereHouseModel {
  public id: number
  public name: string
  public SerialNumber: string

  constructor(id: number, name: string, SerialNumber: string) {
    this.id = id
    this.name = name
    this.SerialNumber = SerialNumber
  }

  static fromMap(data: any): WhereHouseModel {
    return new WhereHouseModel(data.id, data.name, data.serial_number)
  }

  static example: WhereHouseModel[] = [
    new WhereHouseModel(10, 'New House 1', "10"),
    new WhereHouseModel(10, 'New House 2', "10"),
    new WhereHouseModel(10, 'New House 3', "10"),
    new WhereHouseModel(10, 'New House 4', "10"),
    new WhereHouseModel(10, 'New House 5', "10"),
  ]
}
