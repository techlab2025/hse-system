import TitleInterface from '@/base/Data/Models/title_interface'
import { PeriodicTypeEnum } from '../../Core/Enum/periodic_type_enum'

export default class MeetingTypeModel extends TitleInterface {
  public description: string
  public periodicType: PeriodicTypeEnum
  public numberOfDays: number | null

  constructor(
    id: number,
    title: string,
    description: string = '',
    periodicType: PeriodicTypeEnum = PeriodicTypeEnum.DAILY,
    numberOfDays: number | null = null,
  ) {
    super({ id, title })
    this.description = description
    this.periodicType = periodicType
    this.numberOfDays = numberOfDays
  }

  static fromMap(data: any): MeetingTypeModel {
    return new MeetingTypeModel(
      data.id,
      data.title,
      data.description,
      Number(data.periodic_type ?? data.periodicType) as PeriodicTypeEnum,
      (data.number_of_days ?? data.numberOfDays) == null || (data.number_of_days ?? data.numberOfDays) === ''
        ? null
        : Number(data.number_of_days ?? data.numberOfDays),
    )
  }

  static example: MeetingTypeModel[] = [
    new MeetingTypeModel(1, 'Daily meeting', 'Daily operational meeting', PeriodicTypeEnum.DAILY),
    new MeetingTypeModel(2, 'Weekly meeting', 'Weekly team meeting', PeriodicTypeEnum.WEEKLY, 6),
  ]

  static transformData(data: string[][]): MeetingTypeModel[] {
    return data.map(
      (row, index) =>
        new MeetingTypeModel(
          index + 1,
          row[0] || '',
          row[1] || '',
          Number(row[2] || PeriodicTypeEnum.DAILY) as PeriodicTypeEnum,
          row[3] ? Number(row[3]) : null,
        ),
    )
  }
}
