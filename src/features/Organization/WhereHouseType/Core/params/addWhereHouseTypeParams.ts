import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddWhereHouseTypeParams implements Params {
  translation: TranslationsParams
  serial_number?: string

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
  })

  constructor(translation: TranslationsParams, serial_number?: string) {
    this.translation = translation
    this.serial_number = serial_number
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
    if (this.serial_number) data['serial_number'] = Number(this.serial_number)

    return data
  }

  validate() {
    return AddWhereHouseTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddWhereHouseTypeParams.validation.validateOrThrow(this)
  }
}
