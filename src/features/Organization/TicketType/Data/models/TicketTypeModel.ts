import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class TicketTypeModel extends TitleInterface {
  public id: number
  public translation: string

  constructor(id: number, translation: string) {
    super({ id: id, title: translation })

    this.id = id
    this.translation = translation
  }

  static fromMap(data: any): TicketTypeModel {
    return new TicketTypeModel(data.id, data.translation)
  }
}
