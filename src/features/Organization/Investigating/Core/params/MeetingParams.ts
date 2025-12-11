import type Params from '@/base/core/params/params'

export default class MeetingParams implements Params {
  date: string
  time: string
  type?: number
  meeting_link?: string
  corrective?: string

  constructor(
    date: string,
    time: string,
    type?: number,
    meeting_link?: string,
    corrective?: string,
  ) {
    this.date = date
    this.time = time
    this.type = type
    this.meeting_link = meeting_link
    this.corrective = corrective
  }

  toMap(): Record<string, number | any> {
    const data: Record<string, number | any> = {}
    data['date'] = this.date
    data['time'] = this.time
    data['type'] = this.type
    data['meeting_link'] = this.meeting_link
    data['corrective'] = this.corrective
    return data
  }
}
