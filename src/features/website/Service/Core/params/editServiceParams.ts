import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditServiceParams implements Params {
  id: number
  translation: TranslationsParams
  // alt: string
  // image: string
  includes: TranslationsParams[]

  constructor(
    id: number,
    translation: TranslationsParams,
    // alt: string,
    // image: string,
    includes: TranslationsParams[],
  ) {
    this.id = id
    this.translation = translation
    // this.alt = alt/
    // this.image = image
    this.includes = includes
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['service_id'] = this.id
    data['translations'] = this.translation.toMap()
    // data['alt'] = this.alt
    // if (this.image == '' || this.image.startsWith('data:image')) data['image'] = this.image
    data['includes'] = this.includes

    return data
  }
}
