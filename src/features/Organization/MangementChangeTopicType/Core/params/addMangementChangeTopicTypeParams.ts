import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type { MangementChangeTopicTypeEnum } from '../Core/MangementChangeTopicTypeEnum'

export default class AddMangementChangeTopicTypeParams implements Params {
  constructor(public translation: TranslationsParams, public status?: MangementChangeTopicTypeEnum) {}

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
    status: { required: false }
  })

  toMap(): Record<string, unknown> {
    return { translations: this.translation.toMap(), type: this.status }
  }

  validate() {
    return AddMangementChangeTopicTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddMangementChangeTopicTypeParams.validation.validateOrThrow(this)
  }
}
