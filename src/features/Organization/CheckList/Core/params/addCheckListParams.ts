import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddCheckListParams implements Params {
  translation: TranslationsParams

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
  })
  constructor(data: { translation: TranslationsParams }) {
    this.translation = data.translation
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}
    if (this.translation) data['translations'] = this.translation.toMap()
    return data
  }

  validate() {
    return AddCheckListParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddCheckListParams.validation.validateOrThrow(this)
  }
}
