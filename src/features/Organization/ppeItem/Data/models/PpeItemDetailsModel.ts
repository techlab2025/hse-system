import TranslationsParams, {
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'

export default class PpeItemDetailsModel {
  public id: number
  public titles: TitleLocale[]

  constructor(id: number, titles: TitleLocale[]) {
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): PpeItemDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles)
    return new PpeItemDetailsModel(data.id, translations.titles)
  }

  static example: PpeItemDetailsModel = new PpeItemDetailsModel(
    1,
    [{ title: 'Safety helmet', locale: 'en' }],
  )
}
