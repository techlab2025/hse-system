import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientPrivacyModel from "@/features/dashboard/settings/clientPrivacy/Data/models/index_client_term_model";

export default class PrivacyModel extends TitleInterface {
  public id: number
  public hasPrivacy: number
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
    hasPrivacy: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    titles: string,
    descriptions: string,
  ) {
    super({ id, title, subtitle })

    this.id = id
    this.hasPrivacy = hasPrivacy
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.descriptions = descriptions
  }

  static fromMap(data: any): PrivacyModel {
    return new PrivacyModel(
      data.id,
      data.title,
      data.subtitle,
      data.has_term,
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
