import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddServiceFeatureParams implements Params {
  translation: TranslationsParams
  alt: string
  image: string
  items: AddServiceFeatureParams[] = []
  service_id?: number

  constructor(
    translation: TranslationsParams,
    alt: string,
    image: string,
    items: AddServiceFeatureParams[] = [],
    service_id?: number,
  ) {
    this.translation = translation
    this.alt = alt
    this.image = image
    this.items = items
    this.service_id = service_id
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    if (this.service_id) data['service_id'] = this.service_id

    data['translations'] = this.translation.toMap()

    data['alt'] = this.alt
    if (this.image) data['image'] = this.image


    if (this.items.length > 0) {
      data['items'] = this.items.map((item) => item.toMap())
    }

    return data
  }
}

