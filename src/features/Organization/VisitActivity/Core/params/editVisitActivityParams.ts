import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'

export default class EditVisitActivityParams implements Params {
  constructor(
    public id: number,
    public translation: TranslationsParams,
    public allIndustries: boolean | null = null,
    public industries: number[] = [],
  ) {}

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      visit_activity_id: this.id,
      translations: this.translation.toMap(),
    }
    if (this.allIndustries != null) {
      data.all_industries = this.allIndustries ? 1 : 0
      if (!this.allIndustries) data.industry_ids = this.industries
    }
    return data
  }
}
