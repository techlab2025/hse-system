import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class implements Params {
  id: number
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  guide_category_id?: number

  constructor(
    id: number,
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    guide_category_id?: number,

  ) {
    this.id = id
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.guide_category_id = guide_category_id

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

    data['guide_category_item_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.guide_category_id) data['guide_category_id'] = this.guide_category_id

    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries

    return data
  }
}
