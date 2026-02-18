import type Params from '@/base/core/params/params'
import type AddSerialNumberParams from './addSerialNumberParams'
import type { SertialNumberStatusEnum } from '../Enums/SerialNumberStatusEnum'

export default class CreateCodingSystemParams implements Params {
  codes: AddSerialNumberParams[]
  codeSystemType: SertialNumberStatusEnum

  constructor(codes: AddSerialNumberParams[], codeSystemType: SertialNumberStatusEnum) {
    this.codes = codes
    this.codeSystemType = codeSystemType
  }

  toMap(): Record<string, string | number[] | string[] | number | any | Record<string, string>> {
    const data: Record<
      string,
      string | number[] | number | string[] | any | Record<string, string>
    > = {}
    data['codes'] = this.codes
    data['code_system_type'] = this.codeSystemType
    return data
  }
}
