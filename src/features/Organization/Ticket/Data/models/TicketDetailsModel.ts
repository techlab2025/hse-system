import type { TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TranslationsModel from '@/base/core/Models/translations_model'

export default class TicketDetailsModel {
  public id: number
  public translation: TranslationsModel
  public description: string
  public type: string
  public media: string[]
  public title: string
  public status: number

  constructor(id: number, translation: TranslationsModel, description: string, type: string, media: string[], title: string, status: number) {
    this.id = id
    this.translation = translation
    this.description = description
    this.type = type
    this.media = media  
    this.title = title
    this.status = status
  }

  static fromMap(data: any): TicketDetailsModel {
    return new TicketDetailsModel(data.id, TranslationsModel.fromData(data.titles), data.description, data.type, data.media, data.title, data.status    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
