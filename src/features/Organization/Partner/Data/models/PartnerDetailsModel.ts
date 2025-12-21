// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class PartnerDetailsModel {
  public id: number
  public titles: TitleLocale[]

  public phone: string

  constructor(
    id: number,
    titles: TitleLocale[],

    phone: string,
  ) {
    this.id = id
    this.titles = titles

    this.phone = phone
  }

  static fromMap(data: any): PartnerDetailsModel {
    return new PartnerDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,

      data.phone,
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
