import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type { ParentTypeEnum } from '../enums/parenttypeenum'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type CatalogItemsParams from './CatalogGuideItemParams'
import type AddCatalogItemsDetailsParams from '@/features/setting/CatalogItemsDetails/Core/params/addCatalogItemsDetailsParams'

export default class AddCatalogItemsParams implements Params {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  order: number
  parentId?: number
  parentType?: ParentTypeEnum
  guideCategoryItems?: CatalogItemsParams
  // serial_number: string

  public static readonly validation = new ClassValidation().setRules({
    parentId: { required: true },
  })
  constructor(
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    order: number,
    parentId?: number,
    parentType?: ParentTypeEnum,
    guideCategoryItems?: CatalogItemsParams,
    // serial_number: string,
  ) {
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.order = order
    this.parentId = parentId
    this.parentType = parentType
    this.guideCategoryItems = guideCategoryItems
    // this.serial_number = serial_number
  }

  toMap(): Record<
    string,
    | number
    | string
    | number[]
    | any
    | Record<string, string | number[] | number | any | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | any | Record<string, string>>
      | any
    > = {}

    data['translations'] = this.translation.toMap() // tranlations:asd
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries
    data['order'] = this.order
    if (this.parentId) data['parent_id'] = this.parentId
    if (this.parentType) data['parent_type'] = this.parentType
    if (this.guideCategoryItems) data['guide_category_items'] = [this.guideCategoryItems.toMap()]
    // data['serial_number'] = Number(this.serial_number)
    // if (this.image) data['image'] = this.image

    return data
  }

  validate() {
    return AddCatalogItemsParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddCatalogItemsParams.validation.validateOrThrow(this)
  }
}
