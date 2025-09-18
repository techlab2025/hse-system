import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class CreateIndustryParams implements Params {
  title: TranslationsParams

  constructor(title: TranslationsParams) {
    this.title = title
  }

  toMap(): Record<string, number | string | Record<string, string>> {
    const data: Record<string, number | string | Record<string, string>> = {}
    data['title'] = this.title.toMap()

    return data
  }
}
