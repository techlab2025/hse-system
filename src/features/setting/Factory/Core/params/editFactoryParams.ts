import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditFactoryParams implements Params {
  id: number
  translation: TranslationsParams
  allIndustries: boolean
  industries: number[]

  constructor(
    id: number,
    translation: TranslationsParams,
    allIndustries: boolean,
    industries: number[],
  ) {
    this.id = id
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['factory_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries

    return data
  }
}

