import type Params from '@/base/core/params/params'

export default class AddMeetingParams implements Params {
  public investigationId: number
  public date: string
  public time: string
  public meetingLink: string
  constructor(investigationId: number, date: string, time: string, meetingLink: string) {
    this.investigationId = investigationId
    this.date = date
    this.time = time
    this.meetingLink = meetingLink
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    data['investigation_id'] = this.investigationId
    data['date'] = this.date
    data['time'] = this.time
    data['meeting_link'] = this.meetingLink
    return data
  }
}
