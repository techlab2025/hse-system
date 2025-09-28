import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddFaqParams implements Params {
  translation: TranslationsParams
  // hasFaq: number
  // allIndustries: number
  // industries: number[]
  // parentId: number


  constructor(
    translation: TranslationsParams,
    // hasFaq: number,
    // allIndustries: number,
    // industries: number[],
    // parentId: number,

  ) {
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

    data['translations'] = this.translation.toMap()
    // data['has_faq'] = this.hasFaq ? 1 : 0
    // data['all_industries'] = this.allIndustries ? 1 : 0
    // console.log(this.allIndustries)
    // if (!this.allIndustries) data['industry_ids'] = this.industries
    // if (this.parentId) data['parent_id'] = this.parentId


    return data
  }
}
