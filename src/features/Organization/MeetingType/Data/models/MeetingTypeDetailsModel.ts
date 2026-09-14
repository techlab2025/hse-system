import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import { MeetingTypePeriodicEnum } from '../../Core/constant/MeetingTypesEnum'

export default class MeetingTypeDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public type: MeetingTypePeriodicEnum
  public number_of_days: number

  constructor(data: {
    id: number
    titles: TitleLocale[]
    type: MeetingTypePeriodicEnum
    number_of_days: number
  }) {
    this.id = data.id
    this.titles = data.titles
    this.type = data.type
    this.number_of_days = data.number_of_days
  }

  static fromMap(data: any): MeetingTypeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles)
    return new MeetingTypeDetailsModel({
      id: data.id,
      titles: translations.titles,
      number_of_days: data.number_of_days,
      type: data.type,
    })
  }

  static example: MeetingTypeDetailsModel = new MeetingTypeDetailsModel({
    id: 1,
    titles: [{ title: 'Safety helmet', locale: 'en' }],
    number_of_days: 10,
    type: MeetingTypePeriodicEnum.Daily,
  })
}
