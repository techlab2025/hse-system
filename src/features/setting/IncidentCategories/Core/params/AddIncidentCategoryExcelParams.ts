import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
interface Data extends LookupIndustryFields {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  serialNumber: string
}
export default class AddIncidentCategoryExcelParams implements Params {
  data: Data[]
  public static readonly validation = new ClassValidation().setRules({})

  constructor(data: { data: Data[] }, industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data.data, industryScope)
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}

    data['data'] = this.data

    return data
  }
}
