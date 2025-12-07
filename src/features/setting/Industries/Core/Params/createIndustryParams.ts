import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class CreateIndustryParams implements Params {
  title: TranslationsParams

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true },
  })

  constructor(title: TranslationsParams) {
    this.title = title
  }

  toMap(): Record<string, number | string | Record<string, string>> {
    const data: Record<string, number | string | Record<string, string>> = {}
    data['translations'] = this.title.toMap()
    return data
  }

  validate() {
    return CreateIndustryParams.validation.validate(this)
  }

  validateOrThrow() {
    return CreateIndustryParams.validation.validateOrThrow(this)
  }
}
