import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditRoleParams implements Params {
  id: number
  translation: TranslationsParams
  permission: string[]

  constructor(id: number, translation: TranslationsParams, permission: string[]) {
    this.id = id
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
      | string[]
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['role_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.permission) data['permission'] = this.permission

    return data
  }
}
