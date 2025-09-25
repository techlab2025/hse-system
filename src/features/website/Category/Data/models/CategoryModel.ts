import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class CategoryModel extends TitleInterface {
  public id: number
  public hasCategory: number
  public allIndustries: number
  public industries: TitleModel<string>[]
  public parentId: number
  public image: string
  public titles: string
  public descriptions: string

  constructor(
    id: number,
    title: string,
    subtitle: string,
    hasCategory: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    titles: string,
    descriptions: string,
  ) {
    super({ id, title, subtitle })

    this.id = id
    this.hasCategory = hasCategory
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.descriptions = descriptions
  }

  static fromMap(data: any): CategoryModel {
    return new CategoryModel(
      data.id,
      data.title,
      data.subtitle,
      data.has_category,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => TitleModel.fromMap(industry))
        : [],
      data.parent_id,
      data.image,
      data.titles,
      data.descriptions,
    )
  }
}
