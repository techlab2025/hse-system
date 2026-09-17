import type Params from '@/base/core/params/params'

export default class FetchPermitsParams implements Params {
  public projectId: number

  constructor(data: { projectId: number }) {
    this.projectId = data.projectId
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

    data['project_id'] = this.projectId

    return data
  }
}
