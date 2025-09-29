// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class SystemWorkDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public subtitle: TitleLocale[]
  public descriptions: TitleLocale[]
  public image: string
  public alt: string


  constructor(
    id: number,
    titles: TitleLocale[],
    subtitle: TitleLocale[],
    descriptions: TitleLocale[],
    alt: string,
    image: string,

  ) {
    this.id = id
    this.titles = titles
    this.subtitle = subtitle
    this.descriptions = descriptions
    this.alt = alt
    this.image = image

  }

  static fromMap(data: any): SystemWorkDetailsModel {
    return new SystemWorkDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap([], [], data.subtitles).subtitles,
      TranslationsParams.fromMap([], data.descriptions, []).descriptions,
      data.alt,
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
