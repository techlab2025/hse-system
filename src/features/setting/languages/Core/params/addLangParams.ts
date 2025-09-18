import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddLangParams implements Params {
  translation: TranslationsParams
  code: string
  status: number

  constructor(translation: TranslationsParams, code: string, status: number) {
    this.translation = translation
    this.code = code
    this.status = status
  }

  toMap(): Record<string, number | string | Record<string, string>> {
    const data: Record<string, number | string | Record<string, string>> = {}
    data['translation'] = this.translation.toMap()
    data['code'] = this.code
    data['status'] = this.status
    return data
  }

}
