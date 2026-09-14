import TitleInterface from '@/base/Data/Models/title_interface'
import { MeetingTypePeriodicEnum } from '../../Core/constant/MeetingTypesEnum'

export default class MeetingTypeModel extends TitleInterface {
  // public id: number
  // public titles: string
  public type: MeetingTypePeriodicEnum
  public number_of_days: number

  constructor(data: {
    id: number
    title: string
    type: MeetingTypePeriodicEnum
    number_of_days: number
  }) {
    super({ id: data.id, title: data.title })
    this.type = data.type
    this.number_of_days = data.number_of_days
  }

  static fromMap(data: any): MeetingTypeModel {
    return new MeetingTypeModel({
      id: data.id,
      title: data.title,
      number_of_days: data.number_of_days,
      type: data.type,
    })
  }

  static example: MeetingTypeModel[] = [
    new MeetingTypeModel({
      id:1,
      title:'type 1',
      number_of_days:10,
      type:MeetingTypePeriodicEnum.Monthly
    }),
  ]

  static transformData(data: string[][]): MeetingTypeModel[] {
    return data.map((row, index) => new MeetingTypeModel(index + 1, row[0] || ''))
  }
}
