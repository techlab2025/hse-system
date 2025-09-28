import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientFaqModel from "@/features/dashboard/settings/clientFaq/Data/models/index_client_faq_model";

export default class FaqModel extends TitleInterface {
  public id: number
  public hasFaq: number
  public allIndustries: number
  public industries: TitleModel<string>[]
  public parentId: number
  public image: string
  public titles: string
  public question: string
  public answer: string
  public is_active: number


  constructor(
    id: number,
    title: string,
    subtitle: string,
    hasFaq: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    titles: string,
    question: string,
    answer: string,
    is_active: number
  ) {
    super({ id, title, subtitle })

    this.id = id
    this.hasFaq = hasFaq
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.question = question
    this.answer = answer
    this.is_active = is_active
  }

  static fromMap(data: any): FaqModel {
    return new FaqModel(
      data.id,
      data.title,
      data.subtitle,
      data.has_faq,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => TitleModel.fromMap(industry))
        : [],
      data.parent_id,
      data.image,
      data.titles,
      data.question,
      data.answer,
      data.is_active
    )
  }
}
