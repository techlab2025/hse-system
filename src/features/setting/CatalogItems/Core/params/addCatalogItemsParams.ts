import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type { ParentTypeEnum } from '../enums/parenttypeenum'

export default class AddCatalogItemsParams implements Params {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  order: number
  parentId?: number
  parentType?:ParentTypeEnum
  // serial_number: string

  constructor(
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    order: number,
    parentId?: number,
    parentType?: ParentTypeEnum,
    // serial_number: string,
  ) {
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.order = order
    this.parentId = parentId
    this.parentType = parentType
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
    if (this.parentId) data['parent_id'] = this.parentId
    if (this.parentType) data['parent_type'] = this.parentType
    // data['serial_number'] = Number(this.serial_number)
    // if (this.image) data['image'] = this.image

    return data
  }
}
