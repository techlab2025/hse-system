import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type { EquipmentStatus } from '../enum/EquipmentStatus'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

export default class AddEquipmentParams implements Params {
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
  contructorId: number
  description: string

  // hasCertificate: number

  constructor(
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
    contructorId: number,
    description: string,
    // hasCertificate: number,
  ) {
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
    this.contructorId = contructorId
    this.description = description
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

    data['translations'] = this.translation.toMap()
    if (this.equipmentTypeId != null) data['equipment_type_id'] = this.equipmentTypeId
    if (this.date != null) data['date'] = formatJoinDate(this.date)
    if (this.status != null) data['status'] = this.status
    if (this.inspectionDuration != null) data['inspection_duration'] = this.inspectionDuration
    if (this.licenseNumber != null) data['license_number'] = this.licenseNumber
    if (this.licensePlateNumber != null) data['license_plate_number'] = this.licensePlateNumber
    if (this.image != null) data['image'] = this.image
    if (this.certificateImage != null) data['certificate_image'] = this.certificateImage
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (this.industries.length > 0) data['industry_ids'] = this.industries
    if (this.parentId) data['parent_id'] = this.parentId
    if (this.contructorId) data['contructor_id'] = this.contructorId
    if (this.description) data['description'] = this.description

    return data
  }
}
