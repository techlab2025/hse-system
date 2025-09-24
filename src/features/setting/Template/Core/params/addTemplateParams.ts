import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddTemplateParams implements Params {
  translation: TranslationsParams
  allIndustries: boolean
  industries: number[]
  image: string
  items: AddTemplateParams[]

  constructor(
    translation: TranslationsParams,
    allIndustries: boolean,
    industries: number[],
    image: string,
    items: AddTemplateParams[]
  ) {
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.image = image
    this.items = items
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    data['translations'] = this.translation.toMap()
    data['all_industries'] = this.allIndustries ? 1 : 0

    if (!this.allIndustries) {
      data['industry_ids'] = this.industries
    }

    data['image'] = this.image

    if (this.items.length > 0) {
      data['items'] = this.items.map((item) => item.toMap())
    }

    return data
  }
}

