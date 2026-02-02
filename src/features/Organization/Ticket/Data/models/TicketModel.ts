import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class TicketModel extends TitleInterface {
  public id: number
  public translation: string
  public description: string
  public type: string
  public image: string

  constructor(id: number, translation: string, description: string, type: string, image: string) {
    super({ id: id, title: translation })

    this.id = id
    this.translation = translation
    this.description = description
    this.type = type
    this.image = image
  }

  static fromMap(data: any): TicketModel {
    return new TicketModel(data.id, data.translation, data.description, data.type, data.image)
  }
}
