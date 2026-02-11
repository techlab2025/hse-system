import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class CatalogItemsParams implements Params {
  translation: TranslationsParams

  constructor(
    data:{
      translation: TranslationsParams,
    }
  ) {
    this.translation = data.translation
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
    data['translations'] = this.translation.toMap() // tranlations:asd
    return data
  }
}
