import type Params from '@/base/core/params/params'

export default class HirarachyEmployeeParams implements Params {
  hierarchy_id: number

  constructor(hierarchy_id: number) {
    this.hierarchy_id = hierarchy_id
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
    > = {}

    data['hierarchy_id'] = this.hierarchy_id

    return data
  }
}
