import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddServiceParams implements Params {
  translation: TranslationsParams
  alt: string
  image: string
  includes: TranslationsParams[]

  constructor(
    translation: TranslationsParams,
    alt: string,
    image: string,
    includes: TranslationsParams[],
  ) {
    this.translation = translation
    this.alt = alt
    this.image = image
    this.includes = includes
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}

      data['translations'] = this.translation.toMap()
      data['alt'] = this.alt
      data['image'] = this.image
      data['includes'] = this.includes

    return data
  }
}
