import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import type AddHomeAboutUsParams from './addHomeAboutUsParams'

export default class EditHomeAboutUsParams implements Params {
  id: number
  translation: TranslationsParams
  alt: string
  image: string
  items: AddHomeAboutUsParams[]


  constructor(
    id: number,
    translation: TranslationsParams,
    alt: string,
    image: string,
    items: AddHomeAboutUsParams[]

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

    data['home_about_us_id'] = this.id
    data['translations'] = this.translation.toMap()

    data['alt'] = this.alt

    if (this.image && this.image.startsWith('data:image')) data['image'] = this.image

    if (this.items.length > 0) {
      data['items'] = this.items.map((item) => item.toMap())
    }

    return data
  }
}

