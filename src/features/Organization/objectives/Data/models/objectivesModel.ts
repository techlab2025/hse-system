import TitleInterface from '@/base/Data/Models/title_interface'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class ObjectivesModel extends TitleInterface {
  public id: number


  constructor(
    id: number,
    title: string,

  ) {
    super({ id, title })

    this.id = id

  }

  static fromMap(data: any): ObjectivesModel {
    return new ObjectivesModel(
      data.id,
      data.title,

    )
  }
}
