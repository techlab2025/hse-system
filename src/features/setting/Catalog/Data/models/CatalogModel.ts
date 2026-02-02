import TitleInterface from '@/base/Data/Models/title_interface'

export default class CatalogModel extends TitleInterface {
  public id: number
  public title: string

  constructor(
    id: number,
    title: string,

  ) {
    super({ id, title, })

    this.id = id
    this.title = title
  }

  static fromMap(data: any): CatalogModel {
    return new CatalogModel(
      data.id,
      data.title,

    )
  }
}
