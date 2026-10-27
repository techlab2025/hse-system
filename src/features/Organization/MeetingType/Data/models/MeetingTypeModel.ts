import { localizedRecord } from '@/localization/records'
import TitleInterface from '@/base/Data/Models/title_interface'
import { PeriodicTypeEnum } from '../../Core/Enum/periodic_type_enum'
export default class MeetingTypeModel extends TitleInterface {
  public periodicType: PeriodicTypeEnum
  public numberOfDays: number | null
  public allIndustries: boolean
  public industries: { id: number; title?: string }[]

  constructor(
    id: number,
    title: string,
    periodicType: PeriodicTypeEnum = PeriodicTypeEnum.DAILY,
    numberOfDays: number | null = null,
    allIndustries = false,
    industries: { id: number; title?: string }[] = [],
  ) {
    super({
      id,
      title,
      subtitle: JSON.stringify({ periodicType: periodicType, numberOfDays: numberOfDays }),
      decodedData: numberOfDays !== null ? String(numberOfDays) : '',
    })

    this.periodicType = periodicType
    this.numberOfDays = numberOfDays
    this.allIndustries = allIndustries
    this.industries = industries
  }

  static fromMap(data: any): MeetingTypeModel {
    const numberOfDays =
      (data.number_of_days ?? data.numberOfDays) == null ||
      (data.number_of_days ?? data.numberOfDays) === ''
        ? null
        : Number(data.number_of_days ?? data.numberOfDays)

    return localizedRecord(
      new MeetingTypeModel(
        data.id,
        data.title,
        Number(data.periodic_type ?? data.periodicType) as PeriodicTypeEnum,
        numberOfDays,
        data.all_industries === true || Number(data.all_industries) === 1,
        data.industries ?? [],
      ),
      data,
    )
  }

  static example: MeetingTypeModel[] = [
    new MeetingTypeModel(1, 'Daily meeting', PeriodicTypeEnum.DAILY),
    new MeetingTypeModel(2, 'Weekly meeting', PeriodicTypeEnum.WEEKLY, 6),
  ]

  static transformData(data: string[][]): MeetingTypeModel[] {
    return data.map(
      (row, index) =>
        new MeetingTypeModel(
          index + 1,
          row[0] || '',
          Number(row[1] || PeriodicTypeEnum.DAILY) as PeriodicTypeEnum,
          row[2] ? Number(row[2]) : null,
        ),
    )
  }
}
