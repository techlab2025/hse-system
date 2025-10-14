// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleInterface from '@/base/Data/Models/title_interface'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class TemplateItemDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public all_industries: number
  public industries: []
  public action: number
  public requiredImage: boolean

  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    titles: TitleLocale[],
    all_industries: number,
    industries: [],
    action: number,
    requiredImage: boolean,
  ) {
    this.id = id
    this.titles = titles
    this.all_industries = all_industries
    this.industries = industries
    this.action = action
    this.requiredImage = requiredImage
  }

  static fromMap(data: any): TemplateItemDetailsModel {
    return new TemplateItemDetailsModel(
      data.id,
      data.titles ?? [],
      data.all_industries ?? 0,
      data.industries ?? [],
      data.action ?? 0,
      data.require_image,
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
