import TitleInterface from '@/base/Data/Models/title_interface'

export default class WhereHouseTypeModel extends TitleInterface {
  public id: number
  public title: string
  public warehouseTypeId: number

  constructor(id: number, title: string, warehouseTypeId: number) {
    super({ id, title })
    this.id = id
    this.warehouseTypeId = warehouseTypeId
    this.title = title
  }

  static fromMap(data: any): WhereHouseTypeModel {
    return new WhereHouseTypeModel(data.id, data.title, data.warehouse_type_id)
  }

  static example: WhereHouseTypeModel[] = [
    new WhereHouseTypeModel(10, 'New House 1', 10),
    new WhereHouseTypeModel(10, 'New House 2', 10),
    new WhereHouseTypeModel(10, 'New House 3', 10),
    new WhereHouseTypeModel(10, 'New House 4', 10),
    new WhereHouseTypeModel(10, 'New House 5', 10),
  ]
}
