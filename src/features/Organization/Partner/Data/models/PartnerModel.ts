import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientPartnerModel from "@/features/dashboard/settings/clientPartner/Data/models/index_client_Partner_model";

export default class PartnerModel extends TitleInterface {
  public id: number
  public title: string
  public phone: string

  constructor(
    id: number,
    title: string,
    phone: string,

  ) {
    super({ id, title })
    this.id = id
    this.title = title

    this.phone = phone

  }

  static fromMap(data: any): PartnerModel {
    return new PartnerModel(
      data.id,
      data.title,
      data.phone,

    )
  }
}
