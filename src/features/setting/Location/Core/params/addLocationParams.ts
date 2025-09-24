import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'

export default class AddLocationParams implements Params {
  title: TranslationsParams
  code: string
  type: number
  ParentId?: number

  constructor(title: TranslationsParams, code: string, type: number, ParentId?: number) {
    this.title = title
    this.code = code
    this.type = type
    this.ParentId = ParentId
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['translations'] = this.title.toMap()
    data['code'] = this.code
    data['type'] = this.type
    if (this.ParentId) data['parent_id'] = this.ParentId
    return data
  }
}
