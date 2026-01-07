import type Params from '@/base/core/params/params.ts'

export default class FetchInspectionResultParams implements Params {
  public id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['task_id'] = this.id

    return data
  }
}
