import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
import { PeriodicTypeEnum } from '../../Core/Enum/periodic_type_enum'

export default class MeetingTypeDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public periodicType: PeriodicTypeEnum
  public numberOfDays: number | null

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[] = [],
    periodicType: PeriodicTypeEnum = PeriodicTypeEnum.DAILY,
    numberOfDays: number | null = null,
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.periodicType = periodicType
    this.numberOfDays = numberOfDays
  }

  static fromMap(data: any): MeetingTypeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles, data.descriptions)
    return new MeetingTypeDetailsModel(
      data.id,
      translations.titles,
      translations.descriptions,
      Number(data.periodic_type ?? data.periodicType) as PeriodicTypeEnum,
      (data.number_of_days ?? data.numberOfDays) == null || (data.number_of_days ?? data.numberOfDays) === ''
        ? null
        : Number(data.number_of_days ?? data.numberOfDays),
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
