import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'

export default class UpdateIndustryParams implements Params {
  industryId: number
  title: TranslationsParams

  constructor(industryId: number , title: TranslationsParams) {
    this.industryId = industryId;
    this.title = title;
  }

  toMap(): Record<string, number | string | Record<string, string>> {
    const data: Record<string, number | string | Record<string, string>> = {}
    data['industry_id'] = this.industryId
    data['translations'] = this.title.toMap()

    return data
  }
}
