import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditLocationParams implements Params {
  id: number
  title: TranslationsParams
  code: string
  type: number
  ParentId?: number
  constructor(
    id: number,
    title: TranslationsParams,
    code: string,
    type: number,
    ParentId?: number,
  ) {
    this.id = id
    this.title = title
    this.code = code
    this.type = type
    this.ParentId = ParentId
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}
    data['location_id'] = this.id
    data['translations'] = this.title.toMap()
    data['code'] = this.code
    data['type'] = this.type
    if (this.ParentId) data['parent_id'] = this.ParentId

    return data
  }
}
