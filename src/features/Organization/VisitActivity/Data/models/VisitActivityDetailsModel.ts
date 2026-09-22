import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'

type IndustryDetails = { id: number; title?: string; titles?: TitleLocale[] }
type VisitActivityDetailsResponse = {
  id: number
  titles?: TitleLocale[]
  all_industries?: number | boolean
  industries?: IndustryDetails[]
}

export default class VisitActivityDetailsModel {
  constructor(
    public id: number,
    public titles: TitleLocale[],
    public allIndustries = false,
    public industries: TitleInterface[] = [],
  ) {}

  static fromMap(data: VisitActivityDetailsResponse): VisitActivityDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles ?? [], [])
    return new VisitActivityDetailsModel(
      data.id,
      translations.titles,
      Boolean(data.all_industries),
      (data.industries ?? []).map((industry) => new TitleInterface({
        id: industry.id,
        title: industry.title ?? industry.titles?.find((title) => title.locale === localStorage.getItem('lang'))?.title ?? industry.titles?.[0]?.title ?? '',
      })),
    )
  }

  static example = new VisitActivityDetailsModel(1, [
    { title: 'Site inspection', locale: 'en' },
  ])
}
