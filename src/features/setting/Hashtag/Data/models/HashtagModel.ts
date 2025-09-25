import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientHashtagModel from "@/features/dashboard/settings/clientHashtag/Data/models/index_client_hashtag_model";

export default class HashtagModel extends TitleInterface {
  public id: number
  public hasHashtag: number
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
    hasHashtag: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    titles: string,
    descriptions: string,
  ) {
    super({ id, title, subtitle })

    this.id = id
    this.hasHashtag = hasHashtag
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.descriptions = descriptions
  }

  static fromMap(data: any): HashtagModel {
    return new HashtagModel(
      data.id,
      data.title,
      data.subtitle,
      data.has_hashtag,
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
