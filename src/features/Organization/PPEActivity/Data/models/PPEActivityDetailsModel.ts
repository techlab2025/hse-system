import TranslationsParams, {
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'

export default class PPEActivityDetailsModel {
  public id: number
  public titles: TitleLocale[]

  constructor(id: number, titles: TitleLocale[]) {
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): PPEActivityDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles, [])
    return new PPEActivityDetailsModel(data.id, translations.titles)
  }

  static example: PPEActivityDetailsModel = new PPEActivityDetailsModel(1, [
    { title: 'PPE Activity 1', locale: 'en' },
  ])
}
