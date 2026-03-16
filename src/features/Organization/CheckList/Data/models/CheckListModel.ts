import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class CheckListDetailsModel {
  public id: number
  public title: string
  public phone: number
  titles: TitleLocale[]


  constructor(
    id: number,
    title: string,
    phone: number,
    titles: TitleLocale[],
  ) {
    this.id = id
    this.title = title
    this.phone = phone
    this.titles = titles
  }

  static fromMap(data: any): CheckListDetailsModel {
    console.log(data, 'inside model')
    return new CheckListDetailsModel(
      data.id,
      data.title,
      data.phone,
      TranslationsParams.fromMap(data.titles).titles,
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }

  static example: CheckListDetailsModel = new CheckListDetailsModel(1, 'title', 1, [])
}
