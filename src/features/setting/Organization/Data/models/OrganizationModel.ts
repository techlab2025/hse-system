import TitleInterface from '@/base/Data/Models/title_interface'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class OrganizationModel extends TitleInterface {
  public id: number
  public name: string
  public phone: string
  public email: string
  public image: string
  public website_link: string
  public industry: string
  public languages: string

  constructor(
    id: number,
    name: string,
    phone: string,
    email: string,
    image: string,
    website_link: string,
    industry: string,
    languages: string,
  ) {
    super({ id: 0, title: '', subtitle: '' })
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.image = image
    this.website_link = website_link
    this.industry = industry
    this.languages = languages
  }

  static fromMap(data: any): OrganizationModel {
    return new OrganizationModel(
      data.id,
      data.name,
      data.phone,
      data.email,
      data.image,
      data.website_link,
      data.industry,
      data.languages,
    )
  }
}
