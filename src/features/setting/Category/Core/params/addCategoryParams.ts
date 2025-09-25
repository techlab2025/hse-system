import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddCategoryParams implements Params {
  translation: TranslationsParams
  // hasCategory: number
  // allIndustries: number
  // industries: number[]
  // parentId: number
  image: string
  alt: string

  constructor(
    translation: TranslationsParams,
    // hasCategory: number,
    // allIndustries: number,
    // industries: number[],
    // parentId: number,
    image: string,
    alt: string,
  ) {
    this.translation = translation
    // this.hasCategory = hasCategory
    // this.allIndustries = allIndustries
    // this.industries = industries
    // this.parentId = parentId
    this.image = image
    this.alt = alt
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
    // data['has_category'] = this.hasCategory ? 1 : 0
    // data['all_industries'] = this.allIndustries ? 1 : 0
    // console.log(this.allIndustries)
    // if (!this.allIndustries) data['industry_ids'] = this.industries
    // if (this.parentId) data['parent_id'] = this.parentId
    if (this.image) data['image'] = this.image
    if (this.alt) data['alt'] = this.alt

    return data
  }
}
