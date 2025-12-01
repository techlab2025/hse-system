import type TitleInterface from '@/base/Data/Models/title_interface'

export default class MyZonesModel {
  public id: number
  public title: string
  public location: TitleInterface

  constructor(id: number, title: string, location: TitleInterface) {
    this.id = id
    this.title = title
    this.location = location
  }

  static fromMap(data: any): MyZonesModel {
    return new MyZonesModel(data.id, data.title, data.location)
  }
}
