import TranslationsParams, { type DescriptionLocale } from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'
import type ServiceDetailsModel from '@/features/website/Service/Data/models/ServiceDetailsModel'
export default class ServiceSectionDetailsModel {
  public id: number
  public title: TitleInterface[]
  public subTitle: subTitleInterface[]
  public descriptions: DescriptionLocale[]
  public service: ServiceDetailsModel | null
  public serviceId: number | null
  public alt: string
  public image: string

  constructor(
    id: number,
    title: TitleInterface[],
    subTitle: subTitleInterface[],
    descriptions: DescriptionLocale[],
    service: ServiceDetailsModel | null,
    serviceId: number | null,
    alt: string,
    image: string,
  ) {
    this.id = id
    this.title = title
    this.subTitle = subTitle
    this.descriptions = descriptions
    this.service = service
    this.serviceId = serviceId
    this.alt = alt
    this.image = image
  }

  static fromMap(data: any): ServiceSectionDetailsModel {
    return new ServiceSectionDetailsModel(
      data.id,
      data.titles ?? [],
      data.subtitles ?? [],
      TranslationsParams.fromMap([], data.descriptions).descriptions,
      data.service ?? null,
      data.service_id ?? null, // ✅ Support service_id
      data.alt ?? '',
      data.image ?? '',
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

interface subTitleInterface {
  id?: number
  subtitle: string
}
