import TitleInterface from '@/base/Data/Models/title_interface'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class LocationModel extends TitleInterface {
  public id: number
  public title: string
  public code: string
  public parent_id: number
  public type: number
  public status: number
  public image: string

  constructor(
    id: number,
    title: string,
    code: string,
    parent_id: number,
    type: number,
    status: number,
    image: string,
  ) {
    super({ id: 0, title: '', subtitle: '' })
    this.id = id
    this.title = title
    this.code = code
    this.parent_id = parent_id
    this.type = type
    this.status = status
    this.image = image
  }

  static fromMap(data: any): LocationModel {
    return new LocationModel(
      data.id,
      data.title,
      data.code,
      data.parent_id,
      data.type,
      data.status,
      data.image,
    )
  }
}
