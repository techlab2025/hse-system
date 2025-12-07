import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddLangParams implements Params {
  translation: TranslationsParams
  code: string
  status?: number

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
    code: { required: true },
  })

  constructor(translation: TranslationsParams, code: string, status?: number) {
    this.translation = translation
    this.code = code
    this.status = status
  }

  toMap(): Record<string, number | string | Record<string, string>> {
    const data: Record<string, number | string | Record<string, string>> = {}
    data['translations'] = this.translation.toMap()
    data['code'] = this.code
    if (this.status) data['status'] = this.status
    return data
  }

  validate() {
    return AddLangParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddLangParams.validation.validateOrThrow(this)
  }
}
