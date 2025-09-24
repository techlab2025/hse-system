import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditTemplateParams implements Params {
  id: number
  translation: TranslationsParams
  allIndustries: boolean
  industries: number[]
  image: string
  items: EditTemplateParams[]


  constructor(
    id: number,
    translation: TranslationsParams,
    allIndustries: boolean,
    industries: number[],
    image: string,
    items: EditTemplateParams[]

  ) {
    this.id = id
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.image = image
    this.items = items
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['hazard_type_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries

    data['image'] = this.image

    if (this.items.length > 0) {
      data['items'] = this.items.map((item) => item.toMap())
    }

    return data
  }
}

