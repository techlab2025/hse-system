import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'
import type ServiceDetailsModel from '@/features/website/Service/Data/models/ServiceDetailsModel'
export default class ServiceSectionDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public subTitles: TitleLocale[]
  public descriptions: TitleLocale[]
  public service: TitleInterface | null
  public alt: string
  public image: string


  constructor(
    id: number,
    titles: TitleLocale[],
    subTitles: TitleLocale[],
    descriptions: TitleLocale[],
    service: TitleInterface | null,
    alt: string,
    image: string,

  ) {
    this.id = id
    this.titles = titles
    this.subTitles = subTitles
    this.descriptions = descriptions
    this.service = service
    this.alt = alt
    this.image = image
  }

  static fromMap(data: any): ServiceSectionDetailsModel {
    return new ServiceSectionDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap([], [], data.subtitles).subtitles,
      TranslationsParams.fromMap([], data.descriptions, []).descriptions,
      data.service ? this.getTitle(data.service ? data.service : null) : null,
      data.alt ?? '',
      data.image ?? '',
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')
    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
      subtitle: data.subtitles?.find((title: any) => title.locale === savedLocale)?.subtitle
    })
  }
}

interface subTitleInterface {
  id?: number
  subtitle: string

}
