// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class ClientOpinionDetailsModel {
  public id: number
  public name: string
  public rate: number
  public date: string
  public descriptions: DescriptionLocale[]
  public image: string
  public alt: string


  constructor(
    id: number,
    name: string,
    rate: number,
    date: string,
    alt: string,
    image: string,
    descriptions: DescriptionLocale[]

  ) {
    this.id = id
    this.name = name
    this.rate = rate
    this.date = date
    this.alt = alt
    this.image = image
    this.descriptions = descriptions

  }

  static fromMap(data: any): ClientOpinionDetailsModel {
    return new ClientOpinionDetailsModel(
      data.id,
      data.name,
      data.rate,
      data.date,
      data.alt,
      data.image,
      TranslationsParams.fromMap([], data.descriptions).descriptions,
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
