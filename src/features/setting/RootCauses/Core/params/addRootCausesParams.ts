import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddRootCausesParams implements Params {
  translation: TranslationsParams
  allIndustries: number | null
  industries: number[]

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
  })
  constructor(
    translation: TranslationsParams,

    allIndustries: number | null,
    industries: number[],
  ) {
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
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
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries

    return data
  }

  validate() {
    return AddRootCausesParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddRootCausesParams.validation.validateOrThrow(this)
  }
}
