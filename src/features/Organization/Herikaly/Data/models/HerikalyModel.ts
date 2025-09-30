import TitleInterface from '@/base/Data/Models/title_interface'
// import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class HerikalyModel extends TitleInterface {
  public id: number
  public title: string
  public parent_id: number
  public children: HerikalyModel[]

  constructor(id: number, title: string, parent_id: number, children: HerikalyModel[]) {
    super({ id })
    this.id = id
    this.title = title
    this.parent_id = parent_id
    this.children = children
  }

  static fromMap(data: any): HerikalyModel {
    return new HerikalyModel(data.id, data.title, data.parent_id, data.children)
  }
}
