import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditDrillTypeParams implements Params {
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

    data['drill_type_id'] = this.id
    data['translations'] = this.translation.toMap()

    return data
  }
}
