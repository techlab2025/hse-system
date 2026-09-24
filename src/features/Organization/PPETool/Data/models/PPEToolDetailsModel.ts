import TranslationsParams, {
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface'

type IndustryDetails = { id: number; title?: string; titles?: TitleLocale[] }
type PPEToolDetailsResponse = {
  id: number
  titles?: TitleLocale[]
  all_industries?: number | boolean
  industries?: IndustryDetails[]
}

export default class PPEToolDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public allIndustries: boolean
  public industries: TitleInterface[]

  constructor(id: number, titles: TitleLocale[], allIndustries = false, industries: TitleInterface[] = []) {
    this.id = id
    this.titles = titles
    this.allIndustries = allIndustries
    this.industries = industries
  }

  static fromMap(data: PPEToolDetailsResponse): PPEToolDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles ?? [], [])
    return new PPEToolDetailsModel(
      data.id,
      translations.titles,
      Boolean(data.all_industries),
      (data.industries ?? []).map((industry) => new TitleInterface({
        id: industry.id,
        title: industry.title ?? industry.titles?.find((title: TitleLocale) => title.locale === localStorage.getItem('lang'))?.title ?? industry.titles?.[0]?.title ?? '',
      })),
    )
  }

  static example: PPEToolDetailsModel = new PPEToolDetailsModel(1, [
    { title: 'PPE Tool 1', locale: 'en' },
  ])
}
