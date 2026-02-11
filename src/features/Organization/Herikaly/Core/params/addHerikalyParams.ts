import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddHerikalyParams implements Params {
  translation: TranslationsParams
  certificateIds?: number[]
  parentId?: number

  constructor(translation: TranslationsParams, certificateIds?: number[], parentId?: number) {
    this.translation = translation
    this.certificateIds = certificateIds
    this.parentId = parentId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translation.toMap()
    data['certificate_ids'] = this.certificateIds
    if (this.parentId) data['parent_id'] = this.parentId

    return data
  }
}
