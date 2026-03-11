import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddSystemAccidentsTypeParams implements Params {
  cloneIds: number[]
  public static readonly validation = new ClassValidation().setRules({
    cloneIds: { required: true },
  })

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
  validate() {
    return AddSystemAccidentsTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddSystemAccidentsTypeParams.validation.validateOrThrow(this)
  }
}
