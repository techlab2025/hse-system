import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditHeaderParams implements Params {
  id: number
  translation: TranslationsParams
  alt: string
  image: string


  constructor(
    id: number,
    translation: TranslationsParams,
    alt: string,
    image: string
  ) {
    this.id = id
    this.translation = translation
    this.alt = alt
    this.image = image
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['header_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['alt'] = this.alt
    if (this.image == '' || this.image.startsWith('data:image')) data['image'] = this.image

    return data

  }
}

