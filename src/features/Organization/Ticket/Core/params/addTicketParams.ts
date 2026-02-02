import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddTicketParams implements Params {
  translation: TranslationsParams
  type: string
  image: string

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
  })
  constructor(translation: TranslationsParams, type: string, image: string) {
    this.translation = translation
    this.type = type
    this.image = image
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

    data['type'] = this.type
    data['image'] = this.image

    return data
  }

  validate() {
    return AddTicketParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddTicketParams.validation.validateOrThrow(this)
  }
}
