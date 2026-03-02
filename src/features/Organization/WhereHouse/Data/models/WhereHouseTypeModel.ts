import TitleInterface from '@/base/Data/Models/title_interface'

export default class WhereHouseTypeModel extends TitleInterface {
  public title: string
  public warehouse_type_id: number

  constructor(id: number, name: string, title: string , warehouse_type_id: number) {
    super({ id: id, title: name })
    this.title = title
    this.warehouse_type_id = warehouse_type_id
  }

  static fromMap(data: any): WhereHouseTypeModel {
    return new WhereHouseTypeModel(data.id, data.name, data.title , data.warehouse_type_id)
  }

  static example: WhereHouseTypeModel[] = [
    new WhereHouseTypeModel(10, 'New House 1', '10' , 10),
    new WhereHouseTypeModel(10, 'New House 2', '10' , 10),
    new WhereHouseTypeModel(10, 'New House 3', '10' , 10),
    new WhereHouseTypeModel(10, 'New House 4', '10' , 10),
    new WhereHouseTypeModel(10, 'New House 5', '10' , 10),
  ]
}
