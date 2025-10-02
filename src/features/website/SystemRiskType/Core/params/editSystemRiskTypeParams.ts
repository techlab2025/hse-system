import type Params from '@/base/core/params/params.ts'
import type TranslationsParams from '@/base/core/params/translations_params'
export default class EditSystemRiskTypeParams implements Params {
  id: number
  translations: TranslationsParams
  color: string
  alt: string
  image: string
  constructor(
    id: number,
    translations: TranslationsParams,
    color: string,
    alt: string,
    image: string,
  ) {
    this.id = id
    this.translations = translations
    this.color = color
    this.alt = alt
    this.image = image
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['our_system_risk_type_id'] = this.id
    data['translations'] = this.translations.toMap()
    data['color'] = this.color
    data['alt'] = this.alt
    if (this.image == '' || this.image.startsWith('data:image')) data['image'] = this.image
    return data
  }
}
