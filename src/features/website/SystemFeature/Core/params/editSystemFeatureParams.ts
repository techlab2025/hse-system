import type Params from '@/base/core/params/params.ts'
import type TranslationsParams from '@/base/core/params/translations_params'
export default class EditSystemFeatureParams implements Params {
  id: number
  translations: TranslationsParams

  constructor(id: number, translations: TranslationsParams) {
    this.id = id
    this.translations = translations
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['our_system_feature_id'] = this.id
    data['translations'] = this.translations.toMap()

    return data
  }
}
