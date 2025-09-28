import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientOurSystemStepModel from "@/features/dashboard/settings/clientOurSystemStep/Data/models/index_client_blog_model";

export default class OurSystemStepModel extends TitleInterface {
  public id: number
  public hasOurSystemStep: number
  public allIndustries: number
  public industries: TitleModel<string>[]
  public parentId: number
  public image: string
  public titles: string
  public descriptions: string
    public is_active: number


  constructor(
    id: number,
    title: string,
    subtitle: string,
    hasOurSystemStep: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    titles: string,
    descriptions: string,
    is_active: number
  ) {
    super({ id, title, subtitle })

    this.id = id
    this.hasOurSystemStep = hasOurSystemStep
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.descriptions = descriptions
    this.is_active = is_active
  }

  static fromMap(data: any): OurSystemStepModel {
    return new OurSystemStepModel(
      data.id,
      data.title,
      data.subtitle,
      data.has_blog,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => TitleModel.fromMap(industry))
        : [],
      data.parent_id,
      data.image,
      data.titles,
      data.descriptions,
      data.is_active
    )
  }
}
