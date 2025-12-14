import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'

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
    data['date'] = formatJoinDate(this.date)
    data['time'] = formatTime(this.time)
    data['type'] = this.type
    data['meeting_link'] = this.meeting_link
    data['corrective'] = this.corrective
    return data
  }
}
