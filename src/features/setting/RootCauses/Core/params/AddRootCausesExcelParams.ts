import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

interface Data extends LookupIndustryFields {
  translation: TranslationsParams
  allIndustries: number | null
  industries: number[]
}
export default class AddRootCausesExcelParams implements Params {
  public data: Data[]
  public static readonly validation = new ClassValidation("setting/RootCauses/Core/params/AddRootCausesExcelParams").setRules({})
  constructor(data: { data: Data[] }, industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data.data, industryScope)
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}

    data['data'] = this.data
    return data
  }
}
