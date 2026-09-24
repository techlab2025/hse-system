import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface'

type IndustryDetails = { id: number; title?: string; titles?: TitleLocale[] }
type PTWTypeDetailsResponse = {
  id: number
  titles?: TitleLocale[]
  ptw_color?: string
  color?: string
  all_industries?: number | boolean
  industries?: IndustryDetails[]
}

export default class PTWTypeDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public ptw_color: string
  public allIndustries: boolean
  public industries: TitleInterface[]

  constructor(
    id: number,
    titles: TitleLocale[],
    ptw_color: string = '#ff0000',
    allIndustries = false,
    industries: TitleInterface[] = [],
  ) {
    this.id = id
    this.titles = titles
    this.ptw_color = ptw_color
    this.allIndustries = allIndustries
    this.industries = industries
  }

  static fromMap(data: PTWTypeDetailsResponse): PTWTypeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles ?? [], [])
    return new PTWTypeDetailsModel(
      data.id,
      translations.titles,
      data.ptw_color ?? data.color ?? '#ff0000',
      Boolean(data.all_industries),
      (data.industries ?? []).map(
        (industry) =>
          new TitleInterface({
            id: industry.id,
            title:
              industry.title ??
              industry.titles?.find((title) => title.locale === localStorage.getItem('lang'))
                ?.title ??
              industry.titles?.[0]?.title ??
              '',
          }),
      ),
    )
  }

  static example: PTWTypeDetailsModel = new PTWTypeDetailsModel(1, [
    { title: 'Hot Work', locale: 'en' },
  ])
}
