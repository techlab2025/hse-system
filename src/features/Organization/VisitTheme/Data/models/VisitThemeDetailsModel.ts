import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'

type IndustryDetails = { id: number; title?: string; titles?: TitleLocale[] }
type VisitThemeDetailsResponse = {
  id: number
  titles?: TitleLocale[]
  all_industries?: number | boolean
  industries?: IndustryDetails[]
}

export default class VisitThemeDetailsModel {
  constructor(
    public id: number,
    public titles: TitleLocale[],
    public allIndustries = false,
    public industries: TitleInterface[] = [],
  ) {}

  static fromMap(data: VisitThemeDetailsResponse): VisitThemeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles ?? [], [])
    return new VisitThemeDetailsModel(
      data.id,
      translations.titles,
      Boolean(data.all_industries),
      (data.industries ?? []).map((industry) => new TitleInterface({
        id: industry.id,
        title: industry.title ?? industry.titles?.find((title) => title.locale === localStorage.getItem('lang'))?.title ?? industry.titles?.[0]?.title ?? '',
      })),
    )
  }

  static example = new VisitThemeDetailsModel(1, [{ title: 'Routine visit', locale: 'en' }])
}
