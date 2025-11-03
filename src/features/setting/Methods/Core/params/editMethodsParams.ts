import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditMethodsParams implements Params {
  id: number
  translation: TranslationsParams


  constructor(
    id: number,
    translation: TranslationsParams,

  ) {
    this.id = id
    this.translation = translation

  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['method_id'] = this.id
    data['translations'] = this.translation.toMap()

    return data
  }
}
