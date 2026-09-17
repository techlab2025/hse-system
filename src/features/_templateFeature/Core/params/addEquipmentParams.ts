import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddEquipmentParams implements Params {
  translation: TranslationsParams
  hasCertificate: number
  allIndustries: number | null
  industries: number[]
  parentId: number
  // image: string
  equipmentTypeId: number
  equipmentCondition: number | null
  equipmentUsedStatus: number | null

  constructor(
    translation: TranslationsParams,
    hasCertificate: number,
    allIndustries: number | null,
    industries: number[],
    parentId: number,
    // image: string,
    equipmentTypeId: number,
    equipmentCondition: number | null = null,
    equipmentUsedStatus: number | null = null,
  ) {
    this.translation = translation
    this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    // this.image = image
    this.equipmentTypeId = equipmentTypeId
    this.equipmentCondition = equipmentCondition
    this.equipmentUsedStatus = equipmentUsedStatus
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
    data['industry_ids'] = this.industries
    data['equipment_type_id'] = this.equipmentTypeId
    if (this.equipmentCondition != null) data['equipment_condition'] = this.equipmentCondition
    if (this.equipmentUsedStatus != null) data['eqipent_used_status'] = this.equipmentUsedStatus
    if (this.parentId) data['parent_id'] = this.parentId
    // if (this.image) data['image'] = this.image

    return data
  }
}
