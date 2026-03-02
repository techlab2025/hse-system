import TitleInterface from "@/base/Data/Models/title_interface"
import type { ContractorStatusEnum } from "../../Core/Enum/ContractorStatusEnum"

export default class ContractorModel extends TitleInterface {
  public phone: string
  public expire_date: string
  public status: ContractorStatusEnum

  constructor(id: number, name: string, phone: string , expire_date: string , status: ContractorStatusEnum) {
    super({ id, title: name })
    this.phone = phone
    this.expire_date = expire_date
    this.status = status
  }

  static fromMap(data: any): ContractorModel {
    return new ContractorModel(data.id, data.name, data.phone , data.expiry_date , data.status)
  }
}
