import TitleInterface from '@/base/Data/Models/title_interface'

export default class ShiftModel extends TitleInterface {
  public id: number
  public title: string
  public startTime: string
  public endTime: string

  constructor(id: number, title: string, startTime: string, endTime: string) {
    super({ id, title })
    this.id = id
    this.title = title
    this.startTime = startTime
    this.endTime = endTime
  }

  static fromMap(data: any): ShiftModel {
    return new ShiftModel(data.id, data.title, data.start_time, data.end_time)
  }
}
