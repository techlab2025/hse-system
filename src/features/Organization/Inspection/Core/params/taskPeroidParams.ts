import type Params from '@/base/core/params/params'

export default class TaskPeriodParams implements Params {
  public type : number
  public day : number
  public date : string


  constructor(
    type:number,
    day:number,
    date:string,

  ) {
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

    if (this.type != null) data['type'] = this.type
    if (this.day != null) data['day'] = this.day
    if (this.date) data['date'] = this.date



    return data
  }
}
