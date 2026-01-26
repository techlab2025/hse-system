import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class RootCausesDetailsModel {
  public id: number
  public allIndustries: number
  public industries: TitleModel<string>[]
  // public descriptions: DescriptionLocale[]
  public titles: TitleLocale[]

  constructor(
    id: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    titles: TitleLocale[] = [],
  ) {
    this.id = id
    this.allIndustries = allIndustries
    this.industries = industries
    this.titles = titles
  }

  static fromMap(data: any): RootCausesDetailsModel {
    return new RootCausesDetailsModel(
      data.id,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry: any) => this.getTitle(industry))
        : [],
      TranslationsParams.fromMap(data.titles).titles,
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
