import type Params from '@/base/core/params/params'

export default class FetchPermitsAuditsParams implements Params {
  public permitToWorkId: number
  public hasResult?: boolean

  constructor(data: { permitToWorkId: number }) {
    this.permitToWorkId = data.permitToWorkId
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

    data['permit_to_work_id'] = this.permitToWorkId

    return data
  }
}
