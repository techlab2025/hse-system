import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddLocationParams implements Params {
  title: TranslationsParams
  code: string
  type: number
  ParentId?: number

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
    // code: { required: true, minLength: 1, maxLength: 5 },
  })

  constructor(title: TranslationsParams, code: string, type: number, ParentId?: number) {
    this.title = title
    this.code = code
    this.type = type
    this.ParentId = ParentId
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

    data['translations'] = this.title.toMap()
    data['code'] = this.code
    data['type'] = this.type
    if (this.ParentId) data['parent_id'] = this.ParentId
    return data
  }

  validate() {
    return AddLocationParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddLocationParams.validation.validateOrThrow(this)
  }
}
