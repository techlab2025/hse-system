import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditPpeItemParams implements Params {
  constructor(
    public id: number,
    public translation: TranslationsParams,
  ) {}

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

    data['ppe_item_id'] = this.id
    data['translations'] = this.translation.toMap()

    return data
  }
}
