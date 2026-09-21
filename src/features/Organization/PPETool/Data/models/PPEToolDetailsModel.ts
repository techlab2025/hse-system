import TranslationsParams, {
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'

export default class PPEToolDetailsModel {
  public id: number
  public titles: TitleLocale[]

  constructor(id: number, titles: TitleLocale[]) {
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): PPEToolDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles, [])
    return new PPEToolDetailsModel(data.id, translations.titles)
  }

  static example: PPEToolDetailsModel = new PPEToolDetailsModel(1, [
    { title: 'PPE Tool 1', locale: 'en' },
  ])
}
