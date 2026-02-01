import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditTicketParams implements Params {
  id: number
  translation: TranslationsParams
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
  })
  constructor(id: number, translation: TranslationsParams) {
    this.id = id
    this.translation = translation
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

    data['ticket_id'] = this.id
    data['translations'] = this.translation.toMap()

    return data
  }

  validate() {
    return EditTicketParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditTicketParams.validation.validateOrThrow(this)
  }
}
