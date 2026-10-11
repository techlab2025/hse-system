import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { PeriodicTypeEnum } from '../Enum/periodic_type_enum'

export default class EditMeetingTypeParams implements Params {
  constructor(
    public id: number,
    public translation: TranslationsParams,
    public periodicType: PeriodicTypeEnum,
    public numberOfDays: number | null = null,
    public allIndustries: boolean | null = null,
    public industries: number[] = [],
  ) {}

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      meeting_type_id: this.id,
      translations: this.translation.toMap(),
      periodic_type: this.periodicType,
      number_of_days: this.periodicType === PeriodicTypeEnum.DAILY ? null : this.numberOfDays,
    }
    if (this.allIndustries != null) {
      data.all_industries = this.allIndustries ? 1 : 0
      if (!this.allIndustries) data.industry_ids = this.industries
    }
    return data
  }
}
