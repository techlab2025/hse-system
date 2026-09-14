import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { PeriodicTypeEnum } from '../Enum/periodic_type_enum'

export default class AddMeetingTypeParams implements Params {
  constructor(
    public translation: TranslationsParams,
    public periodicType: PeriodicTypeEnum,
    public numberOfDays: number | null = null,
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
    periodicType: { required: true },
  })

  toMap(): Record<string, unknown> {
    return {
      translations: this.translation.toMap(),
      periodic_type: this.periodicType,
      number_of_days:
        this.periodicType === PeriodicTypeEnum.DAILY ? null : this.numberOfDays,
    }
  }

  validate() {
    return AddMeetingTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddMeetingTypeParams.validation.validateOrThrow(this)
  }
}
