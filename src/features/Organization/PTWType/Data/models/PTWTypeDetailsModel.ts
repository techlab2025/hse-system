import TranslationsParams, {
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'

export default class PTWTypeDetailsModel {
  public id: number
  public titles: TitleLocale[]

  constructor(id: number, titles: TitleLocale[]) {
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): PTWTypeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles, [])
    return new PTWTypeDetailsModel(data.id, translations.titles)
  }

  static example: PTWTypeDetailsModel = new PTWTypeDetailsModel(1, [
    { title: 'Hot Work', locale: 'en' },
  ])
}
