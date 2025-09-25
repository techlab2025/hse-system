// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class HomeViewPricingDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public subtitle: TitleLocale[]
  public descriptions: TitleLocale[]
  public buttonTitles: TitleLocale[]
  public image: string
  public alt: string


  constructor(
    id: number,
    titles: TitleLocale[],
    subtitle: TitleLocale[],
    descriptions: TitleLocale[],
    buttonTitles: TitleLocale[],
    alt: string,
    image: string,

  ) {
    this.id = id
    this.titles = titles
    this.subtitle = subtitle
    this.descriptions = descriptions
    this.buttonTitles = buttonTitles
    this.alt = alt
    this.image = image

  }

  static fromMap(data: any): HomeViewPricingDetailsModel {
    return new HomeViewPricingDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap([], [], data.subtitles).langLocale,
      TranslationsParams.fromMap([], data.descriptions, []).descriptions,
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
