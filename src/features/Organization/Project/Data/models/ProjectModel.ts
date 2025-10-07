import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
import type PartnerModel from '@/features/Organization/Partner/Data/models/PartnerModel'
// import ClientProjectModel from "@/features/dashboard/settings/clientProject/Data/models/index_client_Project_model";

export default class ProjectModel extends TitleInterface {
  public id: number
  public title: string
  public partner: PartnerModel

  constructor(
    id: number,
    title: string,
    partner: PartnerModel
  ) {
    super({ id, title })
    this.id = id
    this.title = title
    this.partner = partner

  }

  static fromMap(data: any): ProjectModel {
    return new ProjectModel(
      data.id,
      data.title,
      data.partner,

    )
  }
}
