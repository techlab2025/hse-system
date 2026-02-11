import TitleInterface from '@/base/Data/Models/title_interface'
import CatalogItemsDetailsModel from './CatalogItemsDetailsModel'

export default class CatalogItemsModel extends TitleInterface {
  public id: number
    public title: string

    public guideCategoryItem: CatalogItemsModel | null
  constructor(
    id: number,
    title: string,
    guideCategoryItem: CatalogItemsModel | null

  ) {
    super({ id, title, })

    this.id = id
    this.title = title
    this.guideCategoryItem = guideCategoryItem
  }

  static fromMap(data: any): CatalogItemsModel {
    return new CatalogItemsModel(
      data.id,
      data.title,
      data.guide_category_item

    )
  }
}
