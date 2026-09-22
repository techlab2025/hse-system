import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params'

export default class VisitThemeDetailsModel {
  constructor(
    public id: number,
    public titles: TitleLocale[],
  ) {}

  static fromMap(data: any): VisitThemeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles, [])
    return new VisitThemeDetailsModel(data.id, translations.titles)
  }

  static example = new VisitThemeDetailsModel(1, [{ title: 'Routine visit', locale: 'en' }])
}
