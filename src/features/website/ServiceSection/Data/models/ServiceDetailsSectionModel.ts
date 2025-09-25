import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type ServiceDetailsModel from '@/features/website/Service/Data/models/ServiceDetailsModel'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class ServiceSectionDetailsModel {
  public id: number
  public title: TitleInterface[]
  public subTitle: subTitleInterface[]
  public descriptions: DescriptionLocale[]
  public service: ServiceDetailsModel

  constructor(
    id: number,
    title: TitleInterface[],
    subTitle: subTitleInterface[],
    descriptions: DescriptionLocale[],
    service: ServiceDetailsModel,
  ) {
    this.id = id
    this.title = title
    this.subTitle = subTitle
    this.descriptions = descriptions
    this.service = service
  }

  static fromMap(data: any): ServiceSectionDetailsModel {
    return new ServiceSectionDetailsModel(
      data.id,
      data.title,
      data.subtitles ?? [],
      TranslationsParams.fromMap([], data.descriptions).descriptions,
      data.alt,
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
