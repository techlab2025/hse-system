import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddInjuryParams implements Params {
  translation: TranslationsParams
  serialNumber: number
  allIndustries: boolean | null
  industries: number[]

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
  })

  constructor(
    translation: TranslationsParams,
    serialNumber: number,
    allIndustries: boolean | null,
    industries: number[],
  ) {
    this.translation = translation
    this.serialNumber = serialNumber
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
    data['serial_number'] = Number(this.serialNumber)
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries
    return data
  }

  validate() {
    return AddInjuryParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddInjuryParams.validation.validateOrThrow(this)
  }
}
