import { getCurrentLocale } from '@/localization/i18n'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TranslationsModel from '@/base/core/Models/translations_model'

export default class TicketTypeDetailsModel {
  public id: number
  public translation: TranslationsModel

  constructor(id: number, translation: TranslationsModel) {
    this.id = id
    this.translation = translation
  }

  static fromMap(data: any): TicketTypeDetailsModel {
    return new TicketTypeDetailsModel(data.id, TranslationsModel.fromData(data.titles))
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
