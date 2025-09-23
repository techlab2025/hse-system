import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddAccidentsTypeParams implements Params {
  translation: TranslationsParams
  // hasCertificate: number
  allIndustries: boolean
  industries: number[]
  // parentId: number
  // image: string

  constructor(translation: TranslationsParams, allIndustries: boolean, industries: number[]) {
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
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
    data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries

    return data
  }
}
