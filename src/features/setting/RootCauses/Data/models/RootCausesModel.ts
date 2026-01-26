import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class RootCausesModel extends TitleInterface {
  public id: number
  public allIndustries: number
  public industries: TitleModel<string>[]
  public translation: string

  constructor(
    id: number,
    translation: string,
    title: string,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
  ) {
    super({ id: id, title: title })

    this.id = id
    this.allIndustries = allIndustries
    this.industries = industries
    this.translation = translation
  }

  static fromMap(data: any): RootCausesModel {
    return new RootCausesModel(
      data.id,
      data.translation,
      data.title,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry: any) => TitleModel.fromMap(industry))
        : [],
    )
  }
}
