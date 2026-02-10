import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import AddCatalogItemsParams from './addCatalogItemsParams'

export default class implements Params {
  id: number
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  parentId?: number

      public static readonly validation = new ClassValidation().setRules({
        parentId: { required: true },
      
      })
  constructor(
    id: number,
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    parentId?: number,

  ) {
    this.id = id
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
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

    data['guide_category_id'] = this.id
    data['translations'] = this.translation.toMap()

    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries
if (this.parentId) data['parent_id'] = this.parentId
    return data
  }
    validate() {
    return AddCatalogItemsParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddCatalogItemsParams.validation.validateOrThrow(this)
  }
}
