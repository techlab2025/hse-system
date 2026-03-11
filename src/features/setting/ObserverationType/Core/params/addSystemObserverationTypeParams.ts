import type Params from '@/base/core/params/params'

export default class AddSystemObserverationTypeParams implements Params {
  cloneIds: number[]

  constructor(data: { cloneIds: number[] }) {
    this.cloneIds = data.cloneIds
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

    data['clones_ids'] = this.cloneIds

    return data
  }
}
