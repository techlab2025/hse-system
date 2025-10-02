import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditClientOpinionParams implements Params {
  id: number
  translation: TranslationsParams
  name: string
  rate: number
  date: string
  alt: string
  image: string


  constructor(
    id: number,
    translation: TranslationsParams,
    name: string,
    rate: number,
    date: string,
    alt: string,
    image: string
  ) {
    this.id = id
    this.translation = translation
    this.name = name
    this.rate = rate
    this.date = date
    this.alt = alt
    this.image = image
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['client_opinion_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['name'] = this.name
    data['rate'] = this.rate
    data['date'] = this.date
    data['alt'] = this.alt
    if (this.image == '' || this.image.startsWith('data:image')) data['image'] = this.image

    return data

  }
}

