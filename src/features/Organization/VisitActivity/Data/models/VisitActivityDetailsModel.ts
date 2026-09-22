import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params'

export default class VisitActivityDetailsModel {
  constructor(
    public id: number,
    public titles: TitleLocale[],
  ) {}

  static fromMap(data: any): VisitActivityDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles, [])
    return new VisitActivityDetailsModel(data.id, translations.titles)
  }

  static example = new VisitActivityDetailsModel(1, [
    { title: 'Site inspection', locale: 'en' },
  ])
}
