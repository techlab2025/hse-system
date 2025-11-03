import TitleInterface from '@/base/Data/Models/title_interface'
// import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class ProjectLocationZonesModel extends TitleInterface {
  public title: string
  public zoons: Zoons[]

  constructor(id: number, title: string, zoons: Zoons[]) {
    super({ id })
    this.title = title
    this.zoons = zoons
  }

  static fromMap(data: any): ProjectLocationZonesModel {
    return new ProjectLocationZonesModel(data.id, data.title, data.zoons)
  }
}

interface Zoons {
  id: number
  title: string
  location: location
}

interface location {
  id: number
  title: string
}
