import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { PeriodicTypeEnum } from '../Enum/periodic_type_enum'

export default class EditMeetingTypeParams implements Params {
  constructor(
    public id: number,
    public translation: TranslationsParams,
    public periodicType: PeriodicTypeEnum,
    public numberOfDays: number | null = null,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      meeting_type_id: this.id,
      translations: this.translation.toMap(),
      periodic_type: this.periodicType,
      number_of_days:
        this.periodicType === PeriodicTypeEnum.DAILY ? null : this.numberOfDays,
    }
  }
}
