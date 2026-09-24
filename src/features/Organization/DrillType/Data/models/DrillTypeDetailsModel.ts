import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface'

type IndustryDetails = { id: number; title?: string; titles?: TitleLocale[] }
type DrillTypeDetailsResponse = {
  id: number
  titles?: TitleLocale[]
  descriptions?: DescriptionLocale[]
  all_industries?: number | boolean
  industries?: IndustryDetails[]
}

export default class DrillTypeDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public allIndustries: boolean
  public industries: TitleInterface[]

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[] = [],
    allIndustries = false,
    industries: TitleInterface[] = [],
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.allIndustries = allIndustries
    this.industries = industries
  }

  static fromMap(data: DrillTypeDetailsResponse): DrillTypeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles ?? [], data.descriptions ?? [])
    return new DrillTypeDetailsModel(
      data.id,
      translations.titles,
      translations.descriptions,
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

  static example: DrillTypeDetailsModel = new DrillTypeDetailsModel(
    1,
    [{ title: 'Fire drill', locale: 'en' }],
    [{ description: 'Fire response and assembly drill', locale: 'en' }],
  )
}
