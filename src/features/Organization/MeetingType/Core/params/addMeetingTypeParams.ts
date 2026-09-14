import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type { MeetingTypePeriodicEnum } from '../constant/MeetingTypesEnum'

export default class AddMeetingTypeParams implements Params {
  public translation: TranslationsParams
  public type: MeetingTypePeriodicEnum
  public number_of_days?: number

  constructor(data: {
    translation: TranslationsParams
    type: MeetingTypePeriodicEnum
    number_of_days?: number
  }) {
    this.type = data.type
    this.translation = data.translation
    this.number_of_days = data.number_of_days
  }

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
  })

  toMap(): Record<string, unknown> {
    return {
      translations: this.translation.toMap(),
      type: this.type,
      number_of_days: this.number_of_days,
    }
  }

  validate() {
    return AddMeetingTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddMeetingTypeParams.validation.validateOrThrow(this)
  }
}
