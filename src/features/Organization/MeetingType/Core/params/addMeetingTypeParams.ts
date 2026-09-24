import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { PeriodicTypeEnum } from '../Enum/periodic_type_enum'

export default class AddMeetingTypeParams implements Params {
  constructor(
    public translation: TranslationsParams,
    public periodicType: PeriodicTypeEnum,
    public numberOfDays: number | null = null,
    public allIndustries: boolean | null = null,
    public industries: number[] = [],
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
    periodicType: { required: true },
  })

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
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

  validate() {
    return AddMeetingTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddMeetingTypeParams.validation.validateOrThrow(this)
  }
}
