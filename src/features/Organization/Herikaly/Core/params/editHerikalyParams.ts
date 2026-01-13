import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditHerikalyParams implements Params {
  id: number
  translation: TranslationsParams
  parentId?: number
  certificateIds?: number[]

  constructor(
    id: number,
    translation: TranslationsParams,
    parentId?: number,
    certificateIds?: number[],
  ) {
    this.id = id
    this.translation = translation
    this.parentId = parentId
    this.certificateIds = certificateIds
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['herikaly_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.parentId) data['parent_id'] = this.parentId
    data['certificate_ids'] = this.certificateIds

    return data
  }
}
