import type Params from '@/base/core/params/params'

export default class FetchPermitsParams implements Params {
  public projectId: number
  public hasResult?: boolean

  constructor(data: { projectId: number; hasResult?: boolean }) {
    this.projectId = data.projectId
    this.hasResult = data.hasResult
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
    data['has_result'] = this.hasResult

    return data
  }
}
