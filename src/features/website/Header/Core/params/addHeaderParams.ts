import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddHeaderParams implements Params {
  translation: TranslationsParams
  alt: string
  image: string

  constructor(
    translation: TranslationsParams,
    alt: string,
    image: string

  ) {
    this.translation = translation
    this.alt = alt
    this.image = image

  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    data['translations'] = this.translation.toMap()
    data['alt'] = this.alt
    data['image'] = this.image

    return data

  }
}
