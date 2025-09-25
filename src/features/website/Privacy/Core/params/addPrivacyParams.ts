import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddPrivacyParams implements Params {
  translation: TranslationsParams

  constructor(
    translation: TranslationsParams,

  ) {
    this.translation = translation

  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translation.toMap()


    return data
  }
}
