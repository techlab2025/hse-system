import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class HomeContactUsModel extends TitleInterface {
  public id: number
  public description: string
  public title: string
  public subtitle: string
  public button_title: string
  public image: string
  public alt: string
  public is_active: number
  constructor(
    id: number,
    description: string,
    title: string,
    subtitle: string,
    button_title: string,
    alt: string,
    image: string,
    is_active: number

  ) {
    super({ id })
    this.id = id
    this.description = description
    this.title = title
    this.subtitle = subtitle
    this.button_title = button_title
    this.alt = alt
    this.image = image
    this.is_active = is_active
  }

  static fromMap(data: any): HomeContactUsModel {
    return new HomeContactUsModel(
      data.id,
      data.description,
      data.title,
      data.subtitle,
      data.button_title,
      data.alt,
      data.image,
      data.is_active

    )
  }
}
