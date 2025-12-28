import TitleInterface from '@/base/Data/Models/title_interface'
// import type ProjectLocationZonesModel from '@/features/Organization/Project/Data/models/ProjectLocationZones'
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";
import acc from '@/assets/images/acc.png'

export default class LocationDetailsModel extends TitleInterface {
  public id: number
  public title: string
  public code: string
  public parent: LocationDetailsModel | null
  public type: number
  public status: number
  public image: string
  public zoons :SohwProjectZoonModel[]

  constructor(
    id: number,
    title: string,
    code: string,
    parent: LocationDetailsModel | null,
    type: number,
    status: number,
    image: string,
    zoons: SohwProjectZoonModel[]
  ) {
    super({ id: 0, title: '', subtitle: '' })
    this.id = id
    this.title = title
    this.code = code
    this.parent = parent
    this.type = type
    this.status = status
    this.image = image
    this.zoons = zoons
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
      data.zoons
    )
  }
  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }

  static example: LocationDetailsModel = new LocationDetailsModel(
    1,
    'test',
    "20",
    null,
    1,
    1,
    acc,
    []
  )
}
