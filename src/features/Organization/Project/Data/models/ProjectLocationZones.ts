import TitleInterface from '@/base/Data/Models/title_interface'
// import type ZoonModel from './ZoonModel'
import  TitleModel from '@/base/Data/Models/title_model'
// import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class ProjectLocationZonesModel {
  public location: TitleModel<string>
  public zoons: TitleModel<string>[]

  constructor(location: TitleModel<string>, zoons: TitleModel<string>[]) {
    this.location = location
    this.zoons = zoons
  }

  static fromMap(data: any): ProjectLocationZonesModel {
    return new ProjectLocationZonesModel(TitleModel.fromMap(data), data.zoons.map((z: any) => TitleModel.fromMap(z)))
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
