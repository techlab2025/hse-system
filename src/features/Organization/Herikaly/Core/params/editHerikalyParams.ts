import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditHerikalyParams implements Params {
  id: number
  translation: TranslationsParams
  parentId?: number

  constructor(id: number, translation: TranslationsParams, parentId?: number) {
    this.id = id
    this.translation = translation
    this.parentId = parentId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['herikaly_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['parent_id'] = this.parentId

    return data
  }
}
