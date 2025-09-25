import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class ClientOpinionModel extends TitleInterface {
  public id: number
  public name: string
  public rate: number
  public date: string
  public description: string
  public image: string
  public alt: string
  public is_active: number

  constructor(
    id: number,
    name: string,
    rate: number,
    date: string,
    description: string,
    image: string,
    alt: string,
    is_active: number

  ) {
    super({ id })
    this.id = id
    this.name = name
    this.rate = rate
    this.date = date
    this.description = description
    this.image = image
    this.alt = alt
    this.is_active = is_active
  }

  static fromMap(data: any): ClientOpinionModel {
    return new ClientOpinionModel(
      data.id,
      data.name,
      data.rate,
      data.date,
      data.description,
      data.image,
      data.alt,
      data.is_active

    )
  }
}
