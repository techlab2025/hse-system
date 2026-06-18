import type Params from '@/base/core/params/params'

export default class InvestegationAnotherMeetingParams implements Params {
  public date?: string
  public time?: string
  public type?: number
  public isAnother?: number

  constructor(date?: string, time?: string, type?: number, isAnother?: number) {
    this.date = date
    this.time = time
    this.type = type
    this.isAnother = isAnother
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['date'] = this.date
    data['time'] = this.time
    data['type'] = this.type
    if (this.isAnother != null) data['is_another_meeting'] = this.isAnother
    return data
  }
}
