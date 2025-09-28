import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
export default class AddSystemFeatureParams implements Params {
  translations: TranslationsParams

  constructor(translations: TranslationsParams) {
    this.translations = translations

  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translations.toMap()

    return data
  }
}
