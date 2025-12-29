export default class ContractorDetailsModel {
  public id: number
  public name: string
  public phone: string
  public scope: number
  public companyEmail: string
  public CompanyAddress: string
  public contactPerson: string
  public contactPersonEmail: string
  public contactPersonPhone: string
  public SelectedStatus: number
  public date: string

  constructor(
    id: number,
    name: string,
    phone: string,
    scope: number,
    companyEmail: string,
    CompanyAddress: string,
    contactPerson: string,
    contactPersonEmail: string,
    contactPersonPhone: string,
    SelectedStatus: number,
    date: string,
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.scope = scope
    this.companyEmail = companyEmail
    this.CompanyAddress = CompanyAddress
    this.contactPerson = contactPerson
    this.contactPersonEmail = contactPersonEmail
    this.contactPersonPhone = contactPersonPhone
    this.SelectedStatus = SelectedStatus
    this.date = date
  }

  static fromMap(data: any): ContractorDetailsModel {
    return new ContractorDetailsModel(
      data.id,
      data.name,
      data.phone,
      data.scope,
      data.company_email,
      data.company_address,
      data.contact_person,
      data.contact_person_email,
      data.contact_person_phone,
      data.status,
      data.expiry_date,
    )
  }
}
