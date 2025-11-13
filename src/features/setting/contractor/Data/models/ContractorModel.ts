import TitleInterface from "@/base/Data/Models/title_interface"

export default class ContractorModel extends TitleInterface {
  public phone: string

  constructor(id: number, name: string, phone: string) {
    super({ id, title: name })
    this.phone = phone
  }

  static fromMap(data: any): ContractorModel {
    return new ContractorModel(data.id, data.name, data.phone)
  }
}
