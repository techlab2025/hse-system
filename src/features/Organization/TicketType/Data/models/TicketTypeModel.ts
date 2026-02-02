import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class TicketTypeModel extends TitleInterface {
  public id: number
  public title: string

  constructor(id: number, title: string) {
    super({ id: id, title: title })

    this.id = id
    this.title = title
  }

  static fromMap(data: any): TicketTypeModel {
    return new TicketTypeModel(data.id, data.title)
  }
}
