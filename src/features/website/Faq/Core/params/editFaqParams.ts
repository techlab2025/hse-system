import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditFaqParams implements Params {
  id: number
  translation: TranslationsParams
  // hasFaq: number
  // allIndustries: number
  // industries: number[]
  // parentId: number



  constructor(
    id: number,
    translation: TranslationsParams,


    // industries: number[],

  ) {
    this.id = id
    this.translation = translation
    // this.hasFaq = hasFaq
    // this.allIndustries = allIndustries
    // this.industries = industries
    // this.parentId = parentId

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

    data['faq_id'] = this.id
    data['translations'] = this.translation.toMap()
    // data['has_faq'] = this.hasFaq ? 1 : 0
    // data['all_industries'] = this.allIndustries ? 1 : 0
    // if (!this.allIndustries) data['industry_ids'] = this.industries

    return data
  }
}
