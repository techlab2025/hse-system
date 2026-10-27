import { getCurrentLocale } from '@/localization/i18n'
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class DocumentRefrenceDetailsModel {
  public id: number
  public titles: TitleLocale[]
  constructor(id: number, titles: TitleLocale[]) {
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): DocumentRefrenceDetailsModel {
    return new DocumentRefrenceDetailsModel(data.id, TranslationsParams.fromMap(data.titles).titles)
  }

  static getTitle(data: any) {
    const savedLocale = getCurrentLocale()

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
      localizedTitles: data.titles,
    })
  }
}
