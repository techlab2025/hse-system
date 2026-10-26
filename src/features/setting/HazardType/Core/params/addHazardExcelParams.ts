import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type HazardFactorParams from '../../../SubHazard/Core/params/FactorParams'

interface Data extends LookupIndustryFields {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  FcatorIds: HazardFactorParams[]
  ParentId?: number
}
export default class AddHazardTypeExcelParams implements Params {
  data: Data[]
  public static readonly validation = new ClassValidation("setting/HazardType/Core/params/addHazardExcelParams").setRules({
    // translation: { required: true },
  })
  constructor(data: { data: Data[] }, industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data.data, industryScope)
  }

  toMap(): Record<
    string,
    | any
    | number
    | string
    | number[]
    | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | any | Record<string, string>>
    > = {}

    data['data'] = this.data
    return data
  }
  // validate() {
  //   return AddHazardTypeParams.validation.validate(this)
  // }

  // validateOrThrow() {
  //   return AddHazardTypeParams.validation.validateOrThrow(this)
  // }
}
