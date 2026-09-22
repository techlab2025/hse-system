import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddTraningTopicParams implements Params {
  static validation = new ClassValidation().setRules({
    translation: {
      required: true,
    },
  })

  constructor(public translation: TranslationsParams) {}

  toMap(): Record<string, unknown> {
    const translations = this.translation.toMap() as Record<string, unknown>

    return {
      translations: translations,
    }
  }

  validate() {
    return AddTraningTopicParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddTraningTopicParams.validation.validateOrThrow(this)
  }
}
