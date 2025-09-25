import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientBlogModel from "@/features/dashboard/settings/clientBlog/Data/models/index_client_blog_model";

export default class BlogModel extends TitleInterface {
  public id: number
  public hasBlog: number
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
    hasBlog: number,
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
    this.hasBlog = hasBlog
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.descriptions = descriptions
    this.is_active = is_active
  }

  static fromMap(data: any): BlogModel {
    return new BlogModel(
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
