// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class ContractorDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public allIndustries: number
  public parentId: number
  public image: string
  public industries: TitleModel<string>[]
  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    titles: TitleLocale[],
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
  ) {
    this.id = id
    this.titles = titles
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image

  }

  static fromMap(data: any): ContractorDetailsModel {
    return new ContractorDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => this.getTitle(industry))
        : [],
      data.parent_id,
      data.image,
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
