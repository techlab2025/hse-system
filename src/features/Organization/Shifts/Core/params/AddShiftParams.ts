import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddShiftParams implements Params {
  translation: TranslationsParams
  startTime: string
  endTime: string

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
    startTime: { required: true },
    endTime: { required: true },
  })

  constructor(translation: TranslationsParams, startTime: string, endTime: string) {
    this.translation = translation
    this.startTime = startTime
    this.endTime = endTime
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['translations'] = this.translation.toMap()
    data['start_time'] = this.startTime
    data['end_time'] = this.endTime

    return data
  }

  validate() {
    return AddShiftParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddShiftParams.validation.validateOrThrow(this)
  }
}
