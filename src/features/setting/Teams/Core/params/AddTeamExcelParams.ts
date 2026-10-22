import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'

interface TeamExcelRow extends LookupIndustryFields {
  title: string
}

export default class AddTeamExcelParams implements Params {
  data: TeamExcelRow[]

  constructor(data: { data: TeamExcelRow[] }, industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data.data, industryScope)
  }

  toMap(): Record<string, TeamExcelRow[]> {
    return { data: this.data }
  }
}
