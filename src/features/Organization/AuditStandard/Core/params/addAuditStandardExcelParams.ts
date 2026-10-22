import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'

interface Data extends LookupIndustryFields {
  title: string
}

export default class AddAuditStandardExcelParams implements Params {
  public data: Data[]

  constructor(data: { data: Data[] }, industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data.data, industryScope)
  }

  toMap(): Record<string, any> {
    return { data: this.data }
  }
}
