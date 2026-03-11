import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type TitleModel from '@/base/Data/Models/title_model'

export default class InjuryDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public allIndustries: number
  public industries: TitleModel<string>[]
  constructor(
    id: number,
    titles: TitleLocale[],
    allIndustries: number,
    industries: TitleModel<string>[],
  ) {
    this.id = id
    this.titles = titles
    this.allIndustries = allIndustries
    this.industries = industries
  }

  static fromMap(data: any): InjuryDetailsModel {
    return new InjuryDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => this.getTitle(industry))
        : [],
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
