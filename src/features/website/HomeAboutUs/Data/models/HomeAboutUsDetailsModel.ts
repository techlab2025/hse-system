// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'


export default class HomeAboutUsDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public subTitles: TitleLocale[]
  public descriptions: TitleLocale[]
  public image: string
  public alt: string
  public HomeAboutUsItems: HomeAboutUsDetailsModel[]
  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    titles: TitleLocale[],
    subTitles: TitleLocale[],
    descriptions: TitleLocale[],
    image: string,
    alt: string,
    HomeAboutUsItems: HomeAboutUsDetailsModel[],
  ) {
    this.id = id
    this.titles = titles
    this.subTitles = subTitles
    this.descriptions = descriptions
    this.image = image
    this.alt = alt
    this.HomeAboutUsItems = HomeAboutUsItems

  }

  static fromMap(data: any): HomeAboutUsDetailsModel {
    return new HomeAboutUsDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap([], [], data.subtitles).langLocale,
      TranslationsParams.fromMap([], data.descriptions, []).descriptions,
      data.image,
      data.alt,
      data.items?.length > 0
        ? data.items?.map((item: any) => HomeAboutUsDetailsModel.fromMap(item))
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
