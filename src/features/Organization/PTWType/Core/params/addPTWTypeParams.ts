import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddPTWTypeParams implements Params {
  constructor(
    public translation: TranslationsParams,
    public ptw_color: string = '#ff0000',
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
    ptw_color: { required: true },
  })

  toMap(): Record<string, unknown> {
    const translations = this.translation.toMap() as Record<string, unknown>

    return {
      translations: translations,
      ptw_color: this.ptw_color,
    }
  }

  validate() {
    return AddPTWTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddPTWTypeParams.validation.validateOrThrow(this)
  }
}
