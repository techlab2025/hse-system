import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import type ItemParams from './ItemParams'

export default class EditServiceSectionParams implements Params {
  id: number
  translation: TranslationsParams
  alt: string
  image: string

  constructor(id: number, translation: TranslationsParams, alt: string, image: string) {
    this.id = id
    this.translation = translation
    this.alt = alt
    this.image = image
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['service_section_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['alt'] = this.alt
    data['image'] = this.image

    return data
  }
}
