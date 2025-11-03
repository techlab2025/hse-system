import TitleInterface from '@/base/Data/Models/title_interface'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class MethodsModel extends TitleInterface {
  public id: number

  public title: string

  constructor(
    id: number,
    title: string,

  ) {
    super({ id, title })

    this.id = id

    this.title = title
  }

  static fromMap(data: any): MethodsModel {
    return new MethodsModel(
      data.id,
      data.title,

    )
  }
}
