// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class HomeContactUsDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public subtitle: TitleLocale[]
  public buttonTitles: TitleLocale[]
  public alt: string
  public image: string



  constructor(
    id: number,
    titles: TitleLocale[],
    subtitle: TitleLocale[],
    buttonTitles: TitleLocale[],
    alt: string,
    image: string,

  ) {
    this.id = id

    this.titles = titles
    this.subtitle = subtitle
    this.buttonTitles = buttonTitles
    this.alt = alt
    this.image = image

  }

  static fromMap(data: any): HomeContactUsDetailsModel {
    return new HomeContactUsDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap([], [], data.subtitles).langLocale,
      TranslationsParams.fromMap([], [], data.button_titles).langLocale,
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


