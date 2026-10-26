import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'

interface Data extends LookupIndustryFields {
  title: string
  color: string
}

export default class AddPTWTypeExcelParams implements Params {
  public data: Data[]

  constructor(data: { data: Data[] }, industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data.data, industryScope)
  }

  toMap(): { data: Data[] } {
    return { data: this.data }
  }
}
