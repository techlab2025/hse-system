import ContractorScopeModel from './ContractorScopeMode'

export default class ContractorDetailsModel {
  public id: number
  public name: string
  public phone: string
  public scopes: ContractorScopeModel[]
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
    scopes: ContractorScopeModel[],
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
    this.scopes = scopes
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
      (data.scopes ?? []).map((scope: any) => ContractorScopeModel.fromMap(scope)),
      data.company_email,
      data.company_address,
      data.contact_person,
      data.contact_person_email,
      data.contact_person_phone,
      data.status,
      data.expiry_date,
    )
  }

  static example: ContractorDetailsModel = new ContractorDetailsModel(
    1,
    'Contractor 1',
    '1234567890',
    [ContractorScopeModel.example],
    'Oxk4T@example.com',
    '123 Main St',
    'John Doe',
    'Oxk4T@example.com',
    '1234567890',
    1,
    '2022-01-01',
  )
}
