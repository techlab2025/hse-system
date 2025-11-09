import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class implements Params {
  id: number
  translation: TranslationsParams
  parentId: number
  require_image: number
  action: number

  constructor(
    id: number,
    translation: TranslationsParams,
    require_image: number,
    action: number,
    parentId: number,
  ) {
    this.id = id
    this.translation = translation
    this.require_image = require_image
    this.action = action
    this.parentId = parentId
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

    data['template_item_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.parentId) data['template_id'] = this.parentId
    data['require_image'] = this.require_image
    if (this.action) data['action'] = this.action

    return data
  }
}
