import TitleInterface from '@/base/Data/Models/title_interface'

export default class OrganizatoinEmployeeModel extends TitleInterface {
  public id: number
  public name: string
  public phone: string
  public email: string
  public is_master: number
  public image: null
  constructor(
    id: number,
    title: string,
    name: string,
    phone: string,
    email: string,
    is_master: number,
    image: null,
  ) {
    super({ id, title })

    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.is_master = is_master
    this.image = image
  }

  static fromMap(data: any): OrganizatoinEmployeeModel {
    return new OrganizatoinEmployeeModel(
      data.id,
      data.name,
      data.name,
      data.phone,
      data.email,
      data.is_master,
      data.image,
    )
  }
}
