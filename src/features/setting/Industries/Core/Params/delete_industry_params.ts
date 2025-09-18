import type Params from '@/base/core/params/params'

export default class UpdateIndustryParams implements Params {
  industryId: number

  constructor(industryId: number) {
    this.industryId = industryId
  }

  toMap(): Record<string, number | string | Record<string, string>> {
    const data: Record<string, number | string | Record<string, string>> = {}
    data['industry_id'] = this.industryId

    return data
  }
}
