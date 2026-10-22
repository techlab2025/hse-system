import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'
import type { PeriodicTypeEnum } from '../Enum/periodic_type_enum'

export interface MeetingTypeExcelRow extends LookupIndustryFields {
  title: string
  description?: string
  periodic_type: PeriodicTypeEnum
  number_of_days: number | null
  all_industries?: 0 | 1
  industry_ids?: number[]
}

export default class AddMeetingTypeExcelParams implements Params {
  public data: MeetingTypeExcelRow[]

  constructor(data: { data: MeetingTypeExcelRow[] }, industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data.data, industryScope)
  }

  toMap(): Record<string, unknown> {
    return { data: this.data }
  }
}
