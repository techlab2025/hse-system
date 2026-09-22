import TranslationsParams, {
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'

export default class PTWTypeDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public ptw_color: string

  constructor(id: number, titles: TitleLocale[], ptw_color: string = '#ff0000') {
    this.id = id
    this.titles = titles
    this.ptw_color = ptw_color
  }

  static fromMap(data: any): PTWTypeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles, [])
    return new PTWTypeDetailsModel(
      data.id,
      translations.titles,
      data.ptw_color ?? data.color ?? '#ff0000',
    )
  }

  static example: PTWTypeDetailsModel = new PTWTypeDetailsModel(1, [
    { title: 'Hot Work', locale: 'en' },
  ])
}
