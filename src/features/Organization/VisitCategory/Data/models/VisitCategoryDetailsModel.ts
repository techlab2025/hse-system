import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params'

export default class VisitCategoryDetailsModel {
  constructor(
    public id: number,
    public titles: TitleLocale[],
  ) {}

  static fromMap(data: any): VisitCategoryDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles, [])
    return new VisitCategoryDetailsModel(data.id, translations.titles)
  }

  static example = new VisitCategoryDetailsModel(1, [{ title: 'Routine visit', locale: 'en' }])
}
