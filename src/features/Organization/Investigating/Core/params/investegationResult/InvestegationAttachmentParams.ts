import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'

export default class InvestigationAttachmentsParams implements Params {
  public translations: TranslationsParams
  public files: string[]
  constructor(translations: TranslationsParams, files: string[]) {
    this.translations = translations
    this.files = files
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['translations'] = this.translations.toMap() // tranlations:asd
    data['files'] = this.files
    return data
  }
}
