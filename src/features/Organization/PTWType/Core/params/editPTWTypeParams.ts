import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditPTWTypeParams implements Params {
  constructor(
    public id: number,
    public translation: TranslationsParams,
    public ptw_color: string = '#ff0000',
    public allIndustries: boolean | null = null,
    public industries: number[] = [],
  ) {}

  toMap(): Record<string, unknown> {
    const translations = this.translation.toMap() as Record<string, unknown>

    const data: Record<string, unknown> = {
      permit_type_id: this.id,
      translations: translations,
      ptw_color: this.ptw_color,
    }
    if (this.allIndustries != null) {
      data.all_industries = this.allIndustries ? 1 : 0
      if (!this.allIndustries) data.industry_ids = this.industries
    }
    return data
  }
}
