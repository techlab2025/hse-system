export default class TaskPeriodModel {
  public id: number
  public counter: number
  public counterType: number
  public date: string
  public day: string
  public dayLabel: string
  public status: number
  public type: number

  constructor(
    id: number,
    counter: number,
    date: string,
    counterType: number,
    day: string,
    dayLabel: string,
    status: number,
    type: number,
  ) {
    this.id = id
    this.counter = counter
    this.counterType = counterType
    this.date = date
    this.day = day
    this.dayLabel = dayLabel
    this.status = status
    this.type = type
  }

  static fromMap(data: any): TaskPeriodModel {
    return new TaskPeriodModel(
      data.id,
      data.counter,
      data.counter_type,
      data.data,
      data.day,
      data.day_label,
      data.status,
      data.type,
    )
  }
}
