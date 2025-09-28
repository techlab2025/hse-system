import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import type AddAboutUsCoreParams from './addAboutUsCoreParams'

export default class EditAboutUsCoreParams implements Params {
  id: number
  translation: TranslationsParams
  alt: string
  image: string
  items: AddAboutUsCoreParams[]


  constructor(
    id: number,
    translation: TranslationsParams,
    alt: string,
    image: string,
    items: AddAboutUsCoreParams[]

  ) {
    this.id = id
    this.translation = translation
    this.alt = alt
    this.image = image
    this.items = items
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['about_us_core_id'] = this.id
    data['translations'] = this.translation.toMap()

    data['alt'] = this.alt

    if (this.image && this.image.startsWith('data:image')) data['image'] = this.image

    if (this.items.length > 0) {
      data['items'] = this.items.map((item) => item.toMap())
    }

    return data
  }
}

