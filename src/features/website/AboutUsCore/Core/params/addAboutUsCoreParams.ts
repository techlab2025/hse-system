import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddAboutUsCoreParams implements Params {
  translation: TranslationsParams
  alt: string
  image: string
  items: AddAboutUsCoreParams[] = []

  constructor(
    translation: TranslationsParams,
    alt: string,
    image: string,
    items: AddAboutUsCoreParams[] = [],

  ) {
    this.translation = translation
    this.alt = alt
    this.image = image
    this.items = items
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    data['translations'] = this.translation.toMap()

    data['alt'] = this.alt
    if (this.image) data['image'] = this.image


    if (this.items.length > 0) {
      data['items'] = this.items.map((item) => item.toMap())
    }

    return data
  }
}

