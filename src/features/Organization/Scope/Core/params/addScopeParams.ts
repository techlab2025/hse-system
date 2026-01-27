import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddScopeParams implements Params {
  translation: TranslationsParams
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
  })

  constructor(translation: TranslationsParams) {
    this.translation = translation
  }

  toMap(): Record<
    string,
    | number
    | string
    | string[]
    | number[]
    | any
    | Record<string, string | number[] | string[] | number | any | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | any
      | number[]
      | string[]
      | Record<string, string | number[] | number | string[] | any | Record<string, string>>
    > = {}

    data['translations'] = this.translation.toMap()

    return data
  }

  validate() {
    return AddScopeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddScopeParams.validation.validateOrThrow(this)
  }
}
