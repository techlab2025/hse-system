import type Params from '@/base/core/params/params'

export default class FetchMeetingDetailsParams implements Params {
  public id: number

  constructor(data: { id: number }) {
    this.id = data.id
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

    data['meeting_id'] = this.id

    return data
  }
}
