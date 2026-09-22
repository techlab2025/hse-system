import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddVisitThemeParams implements Params {
  constructor(public translation: TranslationsParams) {}

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
  })

  toMap(): Record<string, unknown> {
    return { translations: this.translation.toMap() }
  }

  validate() {
    return AddVisitThemeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddVisitThemeParams.validation.validateOrThrow(this)
  }
}
