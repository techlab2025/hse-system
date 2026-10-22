import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'

export interface Data extends LookupIndustryFields {
  title: string
}

export default class AddTraningTopicExcelParams implements Params {
  public data: Data[]

  constructor(data: { data: Data[] }, industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data.data, industryScope)
  }

  toMap(): Record<string, Data[]> {
    return {
      data: this.data,
    }
  }
}
