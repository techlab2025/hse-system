import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
import { PeriodicTypeEnum } from '../../Core/Enum/periodic_type_enum'
import TitleInterface from '@/base/Data/Models/title_interface'

type IndustryDetails = { id: number; title?: string; titles?: TitleLocale[] }
type MeetingTypeDetailsResponse = {
  id: number
  titles?: TitleLocale[]
  descriptions?: DescriptionLocale[]
  periodic_type?: number
  periodicType?: number
  number_of_days?: number | string | null
  numberOfDays?: number | string | null
  all_industries?: number | boolean
  industries?: IndustryDetails[]
}

export default class MeetingTypeDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public periodicType: PeriodicTypeEnum
  public numberOfDays: number | null
  public allIndustries: boolean
  public industries: TitleInterface[]

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[] = [],
    periodicType: PeriodicTypeEnum = PeriodicTypeEnum.DAILY,
    numberOfDays: number | null = null,
    allIndustries = false,
    industries: TitleInterface[] = [],
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.periodicType = periodicType
    this.numberOfDays = numberOfDays
    this.allIndustries = allIndustries
    this.industries = industries
  }

  static fromMap(data: MeetingTypeDetailsResponse): MeetingTypeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles ?? [], data.descriptions ?? [])
    return new MeetingTypeDetailsModel(
      data.id,
      translations.titles,
      translations.descriptions,
      Number(data.periodic_type ?? data.periodicType) as PeriodicTypeEnum,
      (data.number_of_days ?? data.numberOfDays) == null ||
      (data.number_of_days ?? data.numberOfDays) === ''
        ? null
        : Number(data.number_of_days ?? data.numberOfDays),
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

  static example: MeetingTypeDetailsModel = new MeetingTypeDetailsModel(
    1,
    [{ title: 'Weekly meeting', locale: 'en' }],
    [{ description: 'Weekly team meeting', locale: 'en' }],
    PeriodicTypeEnum.WEEKLY,
    6,
  )
}
