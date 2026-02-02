import type { TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TranslationsModel from '@/base/core/Models/translations_model'

export default class TicketDetailsModel {
  public id: number
  public translation: TranslationsModel
  public description: string
  public type: string
  public image: string

  constructor(id: number, translation: TranslationsModel, description: string, type: string, image: string) {
    this.id = id
    this.translation = translation
    this.description = description
    this.type = type
    this.image = image
  }

  static fromMap(data: any): TicketDetailsModel {
    return new TicketDetailsModel(data.id, TranslationsModel.fromData(data.titles), data.description, data.type, data.image)
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
