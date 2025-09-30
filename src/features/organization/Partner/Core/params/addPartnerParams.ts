import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddPartnerParams implements Params {
  translation: TranslationsParams
  // hasPartner: number
  // allIndustries: number
  // industries: number[]
  // parentId: number
  phone: string

  constructor(
    translation: TranslationsParams,
    // hasPartner: number,
    // allIndustries: number,
    // industries: number[],
    // parentId: number,
    phone: string,
  ) {
    this.translation = translation
    // this.hasPartner = hasPartner
    // this.allIndustries = allIndustries
    // this.industries = industries
    // this.parentId = parentId
    this.phone = phone
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

    data['translations'] = this.translation.toMap()
    // data['has_Partner'] = this.hasPartner ? 1 : 0
    // data['all_industries'] = this.allIndustries ? 1 : 0
    // console.log(this.allIndustries)
    // if (!this.allIndustries) data['industry_ids'] = this.industries
    // if (this.parentId) data['parent_id'] = this.parentId
    if (this.phone) data['phone'] = this.phone

    return data
  }
}
