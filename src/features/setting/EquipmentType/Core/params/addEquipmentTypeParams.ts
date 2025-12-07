import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddEquipmentTypeParams implements Params {
  translation: TranslationsParams
  hasCertificate: number
  allIndustries: number | null
  industries: number[]
  parentId: number
  image: string
  type: number
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true},
    type: { required: true },
  })
  constructor(
    translation: TranslationsParams,
    hasCertificate: number,
    allIndustries: number | null,
    industries: number[],
    parentId: number,
    image: string,
    type: number,
  ) {
    this.translation = translation
    this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.type = type
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
    data['has_certificate'] = this.hasCertificate ? 1 : 0
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    // console.log(this.allIndustries)
    if (!this.allIndustries) data['industry_ids'] = this.industries
    if (this.parentId) data['parent_id'] = this.parentId
    if (this.image) data['image'] = this.image
    if (this.type) data['type'] = this.type

    return data
  }

  validate() {
    return AddEquipmentTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddEquipmentTypeParams.validation.validateOrThrow(this)
  }
}
