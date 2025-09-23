import TitleInterface from '@/base/Data/Models/title_interface'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class OrganizationModel extends TitleInterface {
  public name: string
  public phone: string
  public email: string
  public image: string

  constructor(name: string, phone: string, email: string, image: string) {
    super({ id: 0, title: '', subtitle: '' })

    this.name = name
    this.phone = phone
    this.email = email
    this.image = image
  }

  static fromMap(data: any): OrganizationModel {
    return new OrganizationModel(data.name, data.phone, data.email, data.image)
  }
}
