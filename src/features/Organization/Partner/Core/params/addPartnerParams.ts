import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddPartnerParams implements Params {
  translation: TranslationsParams

  phone: string

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
    phone: { required: true, minLength: 11, maxLength: 20, pattern: /^\+?\d[\d\s\-()]{4,}$/ },
  })

  constructor(translation: TranslationsParams, phone: string) {
    this.translation = translation
    this.phone = phone
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

    data['translations'] = this.translation.toMap()
    if (this.phone) data['phone'] = this.phone

    return data
  }

  validate() {
    return AddPartnerParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddPartnerParams.validation.validateOrThrow(this)
  }
}
