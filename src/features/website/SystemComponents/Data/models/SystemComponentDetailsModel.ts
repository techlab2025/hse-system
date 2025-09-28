import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class SystemComponentDetailsModel {
  public id: number
  public titles: TitleInterface[]
  public subTitles: subTitleInterface[]
  public isActive: number
  public order: number
  public features: TitleInterface[]

  constructor(
    id: number,
    titles: TitleInterface[],
    subTitles: subTitleInterface[],
    isActive: number,
    order: number,
    features: TitleInterface[],
  ) {
    this.id = id
    this.titles = titles
    this.subTitles = subTitles
    this.isActive = isActive
    this.order = order
    this.features = features
  }

  static fromMap(data: any): SystemComponentDetailsModel {
    return new SystemComponentDetailsModel(
      data.id,
      data.titles,
      data.subtitles,
      data.is_active,
      data.order,
      data.features,
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
