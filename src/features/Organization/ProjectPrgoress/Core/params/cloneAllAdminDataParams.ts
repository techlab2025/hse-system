import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class CloneAllAdminDataParams implements Params {
  public static readonly validation = new ClassValidation().setRules({})

  constructor() {}

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

    return data
  }

  validate() {
    return CloneAllAdminDataParams.validation.validate(this)
  }

  validateOrThrow() {
    return CloneAllAdminDataParams.validation.validateOrThrow(this)
  }
}
