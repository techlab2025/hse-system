import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditRootCausesParams implements Params {
  id: number
  translation: TranslationsParams
  allIndustries: number | null
  industries: number[]
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
    // title: { required: true },
  })
  constructor(
    id: number,
    translation: TranslationsParams,
    allIndustries: number | null,
    industries: number[],
  ) {
    this.id = id
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

    data['root_cause_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries

    return data
  }

  validate() {
    return EditRootCausesParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditRootCausesParams.validation.validateOrThrow(this)
  }
}
