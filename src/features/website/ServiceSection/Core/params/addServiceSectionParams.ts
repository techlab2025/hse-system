import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddServiceSectionParams implements Params {
  translation: TranslationsParams
  alt: string
  image: string
  serviceId: number
  constructor(translation: TranslationsParams, alt: string, image: string, serviceId: number) {
    this.translation = translation
    this.alt = alt
    this.image = image
    this.serviceId = serviceId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translation.toMap()
    data['alt'] = this.alt
    if (this.image) data['image'] = this.image
    data['service_id'] = this.serviceId
    return data
  }
}
