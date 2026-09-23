import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddTraningTopicClonesParams implements Params {
  clonesIds: number[]

  public static readonly validation = new ClassValidation().setRules({
    clonesIds: { required: true },
  })

  constructor(data: { clonesIds: number[] }) {
    this.clonesIds = data.clonesIds
  }

  toMap(): Record<string, number[]> {
    return { clones_ids: this.clonesIds }
  }

  validate() {
    return AddTraningTopicClonesParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddTraningTopicClonesParams.validation.validateOrThrow(this)
  }
}
