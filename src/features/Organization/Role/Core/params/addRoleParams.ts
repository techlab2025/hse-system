import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddRoleParams implements Params {
  translation: TranslationsParams
  permission: string[]

  constructor(translation: TranslationsParams, permission: string[]) {
    this.translation = translation
    this.permission = permission
  }

  toMap(): Record<
    string,
    | number
    | string
    | string[]
    | number[]
    | Record<string, string | number[] | string[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | string[]
      | Record<string, string | number[] | number | string[] | Record<string, string>>
    > = {}

    data['translations'] = this.translation.toMap()
    if (this.permission) data['permission'] = this.permission
    return data
  }
}
