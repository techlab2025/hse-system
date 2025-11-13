export default class ContractorDetailsModel {
  public id: number
  public name: string
  public phone: string

  constructor(id: number, name: string, phone: string) {
    this.id = id
    this.name = name
    this.phone = phone
  }

  static fromMap(data: any): ContractorDetailsModel {
    return new ContractorDetailsModel(data.id, data.name, data.phone)
  }
}
