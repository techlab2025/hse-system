import type { TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TranslationsModel from '@/base/core/Models/translations_model'
import TicketHistoryModel from './TicketHistoryModel'
import type TitleModel from '@/base/core/Models/title_model'

export default class TicketDetailsModel {
  public id: number
  public translation: TranslationsModel
  public description: string
  public type: string
  public media: string[]
  public title: string
  public status: number
  public createdAt: string
  public replies: TicketHistoryModel[]
  public ticketType: TitleModel

  constructor(
    id: number,
    translation: TranslationsModel,
    description: string,
    type: string,
    media: string[],
    title: string,
    status: number,
    createdAt: string,
    replies: TicketHistoryModel[],
    ticketType: TitleModel,
  ) {
    this.id = id
    this.translation = translation
    this.description = description
    this.type = type
    this.media = media
    this.title = title
    this.status = status
    this.createdAt = createdAt
    this.replies = replies
    this.ticketType = ticketType
  }

  static fromMap(data: any): TicketDetailsModel {
    return new TicketDetailsModel(
      data.id,
      TranslationsModel.fromData(data.titles),
      data.description,
      data.type,
      data.media,
      data.title,
      data.status,
      data.created_at,
      data.ticket_replies.map((reply: any) => TicketHistoryModel.fromMap(reply)),
      data.ticket_type,
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
