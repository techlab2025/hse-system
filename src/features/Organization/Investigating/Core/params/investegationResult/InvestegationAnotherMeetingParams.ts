import type Params from '@/base/core/params/params'

export default class InvestegationAnotherMeetingParams implements Params {
  public date?: string
  public time?: string
  public type?: number
  public place?: string

  constructor(date?: string, time?: string, type?: number, place?: string) {
    this.date = date
    this.time = time
    this.type = type
    this.place = place
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['date'] = this.date
    data['time'] = this.time
    data['type'] = this.type
    data['place'] = this.place
    return data
  }
}
