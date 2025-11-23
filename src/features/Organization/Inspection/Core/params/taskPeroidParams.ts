import type Params from '@/base/core/params/params'

export default class TaskPeriodParams implements Params {
  public type: number | null
  public day: number | null
  public date: string | null

  constructor(type: number | null, day: number | null, date: string | null) {
    this.type = type
    this.day = day
    this.date = date
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    if (this.type !== null) data.type = this.type
    if (this.day !== null) data.day = this.day
    if (this.date !== null) data.date = this.date

    return data
  }
}
