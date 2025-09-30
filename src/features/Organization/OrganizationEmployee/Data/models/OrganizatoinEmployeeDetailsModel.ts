
export default class OrganizatoinEmployeeDetailsModel {
  public id: number
  public name: string
  public phone: string
  public email: string
  public is_master: number
  public image: null

  constructor(
    id: number,
    name: string,
    phone: string,
    email: string,
    is_master: number,
    image: null,
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.is_master = is_master
    this.image = image
  }

  static fromMap(data: any): OrganizatoinEmployeeDetailsModel {
    return new OrganizatoinEmployeeDetailsModel(
      data.id,
      data.name,
      data.phone,
      data.email,
      data.is_master,
      data.image,
    )
  }
}
