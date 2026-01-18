import type Params from '@/base/core/params/params'
import type AddSerialNumberParams from './addSerialNumberParams'

export default class CreateCodingSystemParams implements Params {
  codes: AddSerialNumberParams[]

  constructor(codes: AddSerialNumberParams[]) {
    this.codes = codes
  }

  toMap(): Record<string, string | number[] | string[] | number | any | Record<string, string>> {
    const data: Record<
      string,
      string | number[] | number | string[] | any | Record<string, string>
    > = {}
    data['codes'] = this.codes
    return data
  }
}
