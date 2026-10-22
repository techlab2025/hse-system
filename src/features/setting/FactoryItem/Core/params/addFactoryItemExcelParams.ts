import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'

export interface FactoryItemExcelRow extends LookupIndustryFields {
  title: string
  factory_id: number
}

export default class AddFactoryItemExcelParams implements Params {
  constructor(public data: FactoryItemExcelRow[], industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data, industryScope)
  }
  toMap(): { data: FactoryItemExcelRow[] } {
    return {
      data: this.data.map((row) => ({ ...row, title: row.title.trim(), factory_id: row.factory_id })),
    }
  }
}
