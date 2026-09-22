import TranslationsParams, {
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'

export default class InductionDetailsModel {
  public id: number
  public titles: TitleLocale[]

  constructor(id: number, titles: TitleLocale[]) {
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): InductionDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles, [])
    return new InductionDetailsModel(data.id, translations.titles)
  }

  static example: InductionDetailsModel = new InductionDetailsModel(1, [
    { title: 'PPE Tool 1', locale: 'en' },
  ])
}
