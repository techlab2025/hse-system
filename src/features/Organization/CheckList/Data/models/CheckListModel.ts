import { getCurrentLocale } from '@/localization/i18n'
import { localizedRecord } from '@/localization/records'
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class CheckListDetailsModel {
  public id: number
  public title: string
  public phone: number
  titles: TitleLocale[]

  constructor(id: number, title: string, phone: number, titles: TitleLocale[]) {
    this.id = id
    this.title = title
    this.phone = phone
    this.titles = titles
  }

  static fromMap(data: any): CheckListDetailsModel {
    console.log(data, 'inside model')
    return localizedRecord(
      new CheckListDetailsModel(
        data.id,
        data.title,
        data.phone,
        TranslationsParams.fromMap(data.titles).titles,
      ),
      data,
    )
  }

  static getTitle(data: any) {
    const savedLocale = getCurrentLocale()

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
      localizedTitles: data.titles,
    })
  }

  static example: CheckListDetailsModel = new CheckListDetailsModel(1, 'title', 1, [])
}
