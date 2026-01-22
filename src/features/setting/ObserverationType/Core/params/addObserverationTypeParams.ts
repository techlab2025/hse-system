import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddObserverationTypeParams implements Params {
  translation: TranslationsParams
  // hasCertificate: number
  allIndustries: boolean | null
  industries: number[]
  serialNumber: string
  // parentId: number
  // image: string

  constructor(
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    serialNumber: string,
  ) {
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.serialNumber = serialNumber
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
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries
    data['serialNumber'] = Number(this.serialNumber)

    return data
  }
}
