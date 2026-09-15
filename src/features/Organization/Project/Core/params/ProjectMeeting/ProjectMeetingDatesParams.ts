import type Params from '@/base/core/params/params'
export default class ProjectMeetingDatesParams implements Params {
  public days?: number
  public dates?: string

  constructor(data: { days?: number; dates?: string}) {
    this.days = data.days
    this.dates = data.dates

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
      | any
    > = {}

    data['days'] = this.days
    data['dates'] = this.dates


    return data
  }
}
