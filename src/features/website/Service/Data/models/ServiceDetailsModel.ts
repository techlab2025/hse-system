import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class ServiceDetailsModel {
  public id: number
  public title: TitleLocale[]
  public subTitle: TitleLocale[]
  public descriptions: TitleLocale[]
  public alt: string
  public image: string
  public isActive: number
  public order: number
  public includes: ServiceDetailsModel[]

  constructor(
    id: number,
    title: TitleLocale[],
    subTitle: TitleLocale[],
    descriptions: TitleLocale[],
    alt: string,
    image: string,
    isActive: number,
    order: number,
    includes: ServiceDetailsModel[],
  ) {
    this.id = id
    this.title = title
    this.subTitle = subTitle
    this.descriptions = descriptions
    this.alt = alt
    this.image = image
    this.isActive = isActive
    this.order = order
    this.includes = includes
  }

  static fromMap(data: any): ServiceDetailsModel {
    return new ServiceDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap([], [], data.subtitles).subtitles,
      TranslationsParams.fromMap([], data.descriptions, []).descriptions,
      data.alt,
      data.image,
      data.is_active,
      data.order,
      data.includes?.length > 0 ? data.includes.map((item: any) => ServiceDetailsModel.fromMap(item)) : [],
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
  id: number
  subtitle: string
}
