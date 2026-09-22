import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddVisitCategoryParams implements Params {
  constructor(public translation: TranslationsParams) {}

  static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
  })

  toMap(): Record<string, unknown> {
    return { translations: this.translation.toMap() }
  }

  validate() {
    return AddVisitCategoryParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddVisitCategoryParams.validation.validateOrThrow(this)
  }
}
