import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

export default class TaskPeriodParams implements Params {
  public type: number | null
  public day: number | null
  public date: string | null
  public counter?: string | null
  public counter_type?: string | null

  constructor(
    type: number | null,
    day: number | null,
    date: string | null,
    counter?: string | null,
    counter_type?: string | null,
  ) {
    this.type = type
    this.day = day
    this.date = date
    this.counter = counter
    this.counter_type = counter_type
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
    if (this.date !== null) data.date = formatJoinDate(this.date)
    if (this.counter !== null) data.counter = this.counter
    if (this.counterType !== null) data.counter_type = this.counterType

    return data
  }
}
