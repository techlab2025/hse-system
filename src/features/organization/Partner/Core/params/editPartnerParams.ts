import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditPartnerParams implements Params {
  id: number
  translation: TranslationsParams
  // hasPartner: number
  // allIndustries: number
  // industries: number[]
  // parentId: number
  phone: string
  // phoneId?: number

  constructor(
    id: number,
    translation: TranslationsParams,
    // hasPartner: number,
    // allIndustries: number,
    // industries: number[],
    // parentId: number,
    phone: string,
    // phoneId?: number,
  ) {
    this.id = id
    this.translation = translation
    // this.hasPartner = hasPartner
    // this.allIndustries = allIndustries
    // this.industries = industries
    // this.parentId = parentId
    this.phone = phone
    // this.phoneId = phoneId
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

    data['partner_id'] = this.id
    data['translations'] = this.translation.toMap()
    // data['has_Partner'] = this.hasPartner ? 1 : 0
    // data['all_industries'] = this.allIndustries ? 1 : 0
    // if (!this.allIndustries) data['industry_ids'] = this.industries
    // if (this.parentId) data['parent_id'] = this.parentId
    if (this.phone) data['phone'] = this.phone
    // if (this.phoneId) data['phone_id'] = this.phoneId

    return data
  }
}
