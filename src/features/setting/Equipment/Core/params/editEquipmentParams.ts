import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type { EquipmentStatus } from '../enum/EquipmentStatus'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

export default class implements Params {
  id: number
  translation: TranslationsParams
  equipmentTypeId: number | null = null
  date: string | null = null
  status: EquipmentStatus | null = null
  inspectionDuration: string | null = null
  licenseNumber: string | null = null
  licensePlateNumber: string | null = null
  image: string | null = null
  certificateImage: string | null = null
  allIndustries: number | null
  industries: number[]
  parentId: number
  description?: string
  contructorId?: number
  // hasCertificate: number

  constructor(
    id: number,
    translation: TranslationsParams,
    equipmentTypeId: number | null = null,
    date: string | null = null,
    status: EquipmentStatus | null = null,
    inspectionDuration: string | null = null,
    licenseNumber: string | null = null,
    licensePlateNumber: string | null = null,
    image: string | null = null,
    certificateImage: string | null = null,
    allIndustries: number | null,
    industries: number[],
    parentId: number,
    description?: string,
    contructorId?: number,

    // hasCertificate: number,
  ) {
    this.id = id
    this.translation = translation
    this.equipmentTypeId = equipmentTypeId
    this.date = date
    this.status = status
    this.inspectionDuration = inspectionDuration
    this.licenseNumber = licenseNumber
    this.licensePlateNumber = licensePlateNumber
    this.image = image
    this.certificateImage = certificateImage
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.description = description
    this.contructorId = contructorId

    // this.hasCertificate = hasCertificate
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

    data['equipment_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.date != null) data['date'] = formatJoinDate(this.date)
    if (this.status != null) data['status'] = this.status
    if (this.inspectionDuration != null) data['inspection_duration'] = this.inspectionDuration
    if (this.licenseNumber != null) data['license_number'] = this.licenseNumber
    if (this.licensePlateNumber != null) data['license_plate_number'] = this.licensePlateNumber
    if (this.image != null && this.image.startsWith('data:image')) data['image'] = this.image
    if (this.certificateImage != null)
      if (this.certificateImage && this.certificateImage.startsWith('data:image'))
        data['certificate_image'] = this.certificateImage

    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (this.industries.length > 0) data['industry_ids'] = this.industries
    if (this.parentId) data['parent_id'] = this.parentId
    if (this.contructorId) data['contructor_id'] = this.contructorId

    if (this.description) data['description'] = this.description

    return data
  }
}
