import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class implements Params {
  id: number
  translation: TranslationsParams


  constructor(
    id: number,
    translation: TranslationsParams,

  ) {
    this.id = id
    this.translation = translation

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

    data['objective_id'] = this.id
    data['translations'] = this.translation.toMap()

    // if (this.image) data['image'] = this.image

    return data
  }
}
