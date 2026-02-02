import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class TicketModel extends TitleInterface {
  public id: number
  public title: string
  public description: string
  public type: string
  public images: string[]

  constructor(id: number, title: string, description: string, type: string, images: string[]) {
    super({ id: id, title: title })

    this.id = id
    this.title = title
    this.description = description
    this.type = type
    this.images = images
  }

  static fromMap(data: any): TicketModel {
    return new TicketModel(data.id, data.translation, data.description, data.type, data.images)
  }
}
