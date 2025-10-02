import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddClientOpinionParams implements Params {
  translation: TranslationsParams
  name: string
  rate: number
  date: string
  alt: string
  image: string

  constructor(
    translation: TranslationsParams,
    name: string,
    rate: number,
    date: string,
    alt: string,
    image: string

  ) {
    this.translation = translation
    this.name = name
    this.rate = rate
    this.date = date
    this.alt = alt
    this.image = image

  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    data['translations'] = this.translation.toMap()
    data['name'] = this.name
    data['rate'] = this.rate
    data['date'] = this.date
    data['alt'] = this.alt
    if (this.image) data['image'] = this.image

    return data

  }
}
