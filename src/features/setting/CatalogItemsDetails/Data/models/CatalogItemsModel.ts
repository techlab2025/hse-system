import { localizedRecord } from '@/localization/records'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class CatalogItemsModel extends TitleInterface {
  public id: number
  public title: string
  public description: string

  constructor(id: number, title: string, description: string) {
    super({ id, title })

    this.id = id
    this.title = title
    this.description = description
  }

  static fromMap(data: any): CatalogItemsModel {
    return localizedRecord(new CatalogItemsModel(data.id, data.title, data.description), data)
  }
}
