import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class ShiftDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public startTime: string
  public endTime: string

  constructor(id: number, titles: TitleLocale[], startTime: string, endTime: string) {
    this.id = id
    this.titles = titles
    this.startTime = startTime
    this.endTime = endTime
  }

  static fromMap(data: any): ShiftDetailsModel {
    return new ShiftDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      data.start_time,
      data.end_time,
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
