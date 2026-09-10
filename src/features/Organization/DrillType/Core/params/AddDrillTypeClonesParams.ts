import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddWarehouseTypeClonesParams implements Params {
  clonesIds: number[]

  public static readonly validation = new ClassValidation().setRules({
    clonesIds: { required: true },
  })

  constructor(data: { clonesIds: number[] }) {
    this.clonesIds = data.clonesIds
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

    data['clones_ids'] = this.clonesIds

    return data
  }

  validate() {
    return AddWarehouseTypeClonesParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddWarehouseTypeClonesParams.validation.validateOrThrow(this)
  }
}
