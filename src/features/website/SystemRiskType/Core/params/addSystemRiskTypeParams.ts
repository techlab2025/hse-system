import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
export default class AddSystemRiskTypeParams implements Params {
  translations: TranslationsParams
  color:string
  alt:string
  image:string

  constructor(translations: TranslationsParams , color:string , alt:string, image:string) {
    this.translations = translations
    this.color = color
    this.alt = alt
    this.image = image

  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translations.toMap()
    data['color'] = this.color
    data['alt'] = this.alt
  if(this.image)  data['image'] = this.image
    return data
  }
}
