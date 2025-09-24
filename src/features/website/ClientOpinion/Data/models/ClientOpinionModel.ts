import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class ClientOpinionModel extends TitleInterface {
  public id: number
  // public hasCertificate: number
  public name: string
  public rate: number
  public date: string
  public description: string
  public image: string
  public alt: string

  constructor(
    id: number,
    name: string,
    rate: number,
    date: string,
    description: string,
    alt: string,
    image: string,

  ) {
    super({ id })
    this.id = id
    this.name = name
    this.rate = rate
    this.date = date
    this.description = description
    this.alt = alt
    this.image = image
  }

  static fromMap(data: any): ClientOpinionModel {
    return new ClientOpinionModel(
      data.id,
      data.name,
      data.rate,
      data.date,
      data.description,
      data.alt,
      data.image

    )
  }
}
