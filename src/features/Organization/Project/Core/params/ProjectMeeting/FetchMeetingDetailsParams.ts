import type Params from '@/base/core/params/params'

export default class FetchMeetingDetailsParams implements Params {
  public id: number
  public title: number
  public agenda: string[]

  constructor(data: { id: number; title: number; agenda: string[] }) {
    this.id = data.id
    this.title = data.title
    this.agenda = data.agenda
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

    data['id'] = this.id
    data['title'] = this.title
    data['agenda'] = this.agenda

    return data
  }
}
