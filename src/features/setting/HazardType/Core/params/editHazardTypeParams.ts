import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type HazardFactorParams from './FactorParams'

export default class EditHazardTypeParams implements Params {
  id: number
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  FcatorIds: HazardFactorParams[]

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
  })
  constructor(
    id: number,
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    FcatorIds: HazardFactorParams[],
  ) {
    this.id = id
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.FcatorIds = FcatorIds
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['hazard_type_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries
    if (this.FcatorIds) data['factories'] = this.FcatorIds.map((item) => item.toMap())

    return data
  }
  validate() {
    return EditHazardTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditHazardTypeParams.validation.validateOrThrow(this)
  }
}
