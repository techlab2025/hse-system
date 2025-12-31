import type Params from '@/base/core/params/params'


export default class ScopeIdParams implements Params {
  scopeId: number

  constructor(scopeId: number) {
    this.scopeId = scopeId
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

    data['scope_id'] = this.scopeId

    return data
  }
}
