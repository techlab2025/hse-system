import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'

interface Data extends LookupIndustryFields {
  title: string
}
export default class AddFactorExcelParams implements Params {
  data: Data[]

  constructor(data: { data: Data[] }, industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data.data, industryScope)
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['data'] = this.data
    return data
  }
}
