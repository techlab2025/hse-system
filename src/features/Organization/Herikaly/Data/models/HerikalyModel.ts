import TitleInterface from '@/base/Data/Models/title_interface'
// import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class HerikalyModel extends TitleInterface {
  public id: number
  public title: string
  public parent_id: number
  public children: HerikalyModel[]
  public parent: TitleInterface | null

  constructor(
    id: number,
    title: string,
    parent_id: number,
    children: HerikalyModel[],
    parent: TitleInterface | null = null,
  ) {
    // The shared select adapter keeps subtitle as the secondary option label.
    super({ id, subtitle: parent?.title })
    this.id = id
    this.title = title
    this.parent_id = parent_id
    this.children = children
    this.parent = parent
  }

  static fromMap(data: any): HerikalyModel {
    return new HerikalyModel(
      data.id,
      data.title,
      data.parent_id ?? data.parent?.id,
      data.children,
      data.parent ? new TitleInterface({ id: data.parent.id, title: data.parent.title }) : null,
    )
  }
}
