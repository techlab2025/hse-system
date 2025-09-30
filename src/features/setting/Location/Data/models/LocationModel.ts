import TitleInterface from '@/base/Data/Models/title_interface'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class LocationDetailsModel extends TitleInterface {
  public id: number
  public title: string
  public code: string
  public parent: TitleInterface | null
  public type: number
  public status: number
  public image: string

  constructor(
    id: number,
    title: string,
    code: string,
    parent: TitleInterface | null,
    type: number,
    status: number,
    image: string,
  ) {
    super({ id: 0, title: '', subtitle: '' })
    this.id = id
    this.title = title
    this.code = code
    this.parent = parent
    this.type = type
    this.status = status
    this.image = image
  }

  static fromMap(data: any): LocationDetailsModel {
    return new LocationDetailsModel(
      data.id,
      data.title,
      data.code,
      data.parent?.length > 0 ? data.parent?.map((parent) => this.getTitle(parent)) : [],
      data.type,
      data.status,
      data.image,
    )
  }
  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
