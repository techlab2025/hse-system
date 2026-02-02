import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditTicketParams implements Params {
  id: number
  translation: TranslationsParams
  description: string
  type: string
  image: string
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
  })
  constructor(
    id: number,
    translation: TranslationsParams,
    description: string,
    type: string,
    image: string,
  ) {
    this.id = id
    this.translation = translation
    this.description = description
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

    data['ticket_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['description'] = this.description
    data['type'] = this.type
    data['image'] = this.image

    return data
  }

  validate() {
    return EditTicketParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditTicketParams.validation.validateOrThrow(this)
  }
}
