import type Params from '@/base/core/params/params'

export default class FetchProjectLocationsEmployee implements Params {
  id: number

  constructor(id: number) {
    this.id = id
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

    data['project_id'] = this.id

    return data
  }
}
