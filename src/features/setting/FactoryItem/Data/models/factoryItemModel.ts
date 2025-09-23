import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class FactoryItemModel extends TitleInterface {
  public id: number
  // public hasCertificate: number
  public allIndustries: number
  public industries: TitleModel<string>[]
  public parentId: number
  public image: string
  public titles: string
  public factory: TitleModel<string>

  constructor(
    id: number,
    title: string,
    subtitle: string,
    // hasCertificate: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    titles: string,
    factory: TitleModel<string>,
  ) {
    super({ id, title, subtitle })

    this.id = id
    // this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.factory = factory
  }

  static fromMap(data: any): FactoryItemModel {
    return new FactoryItemModel(
      data.id,
      data.title,
      data.subtitle,
      // data.has_certificate,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => TitleModel.fromMap(industry))
        : [],
      data.parent_id,
      data.image,
      data.titles,
      TitleModel.fromMap(data.factory),
    )
  }
}
