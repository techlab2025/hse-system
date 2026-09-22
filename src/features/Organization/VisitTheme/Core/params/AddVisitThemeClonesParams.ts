import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddVisitThemeClonesParams implements Params {
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
    return AddVisitThemeClonesParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddVisitThemeClonesParams.validation.validateOrThrow(this)
  }
}
