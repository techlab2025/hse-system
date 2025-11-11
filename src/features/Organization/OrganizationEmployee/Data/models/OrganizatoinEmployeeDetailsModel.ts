import TitleInterface from '@/base/Data/Models/title_interface'

export default class OrganizatoinEmployeeDetailsModel {
  public id: number
  public name: string
  public phone: string
  public email: string
  public is_master: number
  public image: null
  // public heriarachy: number
  // public certificates: number

  constructor(
    id: number,
    name: string,
    phone: string,
    email: string,
    is_master: number,
    image: null,
    // heriarachy: number,
    // certificates: number
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.is_master = is_master
    this.image = image
    // this.heriarachy = heriarachy
    // this.certificates = certificates
  }

  static fromMap(data: any): OrganizatoinEmployeeDetailsModel {
    return new OrganizatoinEmployeeDetailsModel(
      data.id,
      data.name,
      data.phone,
      data.email,
      data.is_master,
      data.image,
      // data.heriarachy,
      // data.certificates
    )
  }
}
