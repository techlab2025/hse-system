import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class AboutUsCoreModel extends TitleInterface {
  public id: number
  // public hasCertificate: number
  public title: string
  public subtitle: string
  public image: string
  public is_active: number

  constructor(
    id: number,
    title: string,
    subtitle: string,
    image: string,
      is_active: number
  ) {
    super({ id, title, subtitle })

    this.id = id
    this.title = title
    this.subtitle = subtitle
    this.image = image
    this.is_active = is_active
  }

  static fromMap(data: any): AboutUsCoreModel {
    return new AboutUsCoreModel(
      data.id,
      data.title,
      data.subtitle,
      data.image,
      data.is_active
    )
  }
}
