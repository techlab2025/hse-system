import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddCatalogItemsDetailsParams implements Params {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  order: number
  guidgate_category_id?: number
  // serial_number: string

  constructor(
    data:{
      translation: TranslationsParams,
      allIndustries: boolean | null,
      industries: number[],
      order: number,
      guidgate_category_id?: number,
    }
    // serial_number: string,
  ) {
    this.translation = data.translation
    this.allIndustries = data.allIndustries
    this.industries = data.industries
    this.order = data.order
    this.guidgate_category_id = data.guidgate_category_id
    // this.serial_number = serial_number
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

    data['translations'] = this.translation.toMap() // tranlations:asd
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries
    data['order'] = this.order
    if (this.guidgate_category_id) data['guide_category_id'] = this.guidgate_category_id
    // data['serial_number'] = Number(this.serial_number)
    // if (this.image) data['image'] = this.image

    return data
  }
}
