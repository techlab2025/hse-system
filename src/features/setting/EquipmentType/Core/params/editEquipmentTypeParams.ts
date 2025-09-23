import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/dashboard/users/languages/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditEquipmentTypeParams implements Params {
  id: number
  translation: TranslationsParams
  hasCertificate: number
  allIndustries: number
  industries: number[]
  parentId: number
  image: string
  imageId?: number

  constructor(
    id: number,
    translation: TranslationsParams,
    hasCertificate: number,
    allIndustries: number,
    industries: number[],
    parentId: number,
    image: string,
    imageId?: number,
  ) {
    this.id = id
    this.translation = translation
    this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.imageId = imageId
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

    data['equipment_type_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['has_certificate'] = this.hasCertificate ? 1 : 0
    data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries
    if (this.parentId) data['parent_id'] = this.parentId
    if (this.image) data['image'] = this.image
    if (this.imageId) data['image_id'] = this.imageId

    return data
  }
}
