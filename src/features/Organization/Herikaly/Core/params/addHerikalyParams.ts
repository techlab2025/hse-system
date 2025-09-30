import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddHerikalyParams implements Params {
  translation: TranslationsParams
  parentId?: number

  constructor(translation: TranslationsParams, parentId?: number) {
    this.translation = translation
    this.parentId = parentId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translation.toMap()
    data['parent_id'] = this.parentId
    return data
  }
}
