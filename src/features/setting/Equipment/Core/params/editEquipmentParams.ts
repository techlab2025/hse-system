import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type { EquipmentStatus } from '../enum/EquipmentStatus'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditEquipmentParams implements Params {
  id: number
  translation!: TranslationsParams
  equipmentTypeId: number | null = null
  date: string | null = null
  status!: EquipmentStatus
  inspectionDuration: string | null = null
  licenseNumber: string | null = null
  licensePlateNumber: string | null = null
  image: string | null = null
  certificateImage: string | null = null
  allIndustries: boolean | null = null
  industries: number[] = []
  parentId!: number
  constructorId?: number
  description?: string
  equipmentRentType: number
  equipmentRentTime: string
  equipmentRentStartDate: string
  VehicleKm: string
  serialNumber: string
  SelectedWhereHosue: number

  // hasCertificate: number
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
    equipmentTypeId: { required: true },
  })

  constructor(data: {
    id: number
    translation: TranslationsParams
    equipmentTypeId: number | null
    date: string | null
    status: EquipmentStatus
    inspectionDuration: string | null
    licenseNumber: string | null
    licensePlateNumber: string | null
    image: string | null
    certificateImage: string | null
    allIndustries: boolean | null
    industries: number[]
    parentId: number
    constructorId?: number
    description?: string
    equipmentRentType: number
    equipmentRentTime: string
    equipmentRentStartDate: string
    VehicleKm: string
    serialNumber: string
    SelectedWhereHosue: number
  }) {
    Object.assign(this, data)

    // this.id = id
    // this.translation = translation
    // this.equipmentTypeId = equipmentTypeId
    // this.date = date
    // this.status = status
    // this.inspectionDuration = inspectionDuration
    // this.licenseNumber = licenseNumber
    // this.licensePlateNumber = licensePlateNumber
    // this.image = image
    // this.certificateImage = certificateImage
    // this.allIndustries = allIndustries
    // this.industries = industries
    // this.parentId = parentId
    // this.description = description
    // this.contructorId = contructorId

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

    if (this.parentId != null) data['parent_id'] = this.parentId

    if (this.constructorId != null) data['contractor_id'] = this.constructorId

    if (this.description) data['description'] = this.description
    if (this.equipmentRentType) data['period_type'] = this.equipmentRentType
    if (this.equipmentRentTime) data['period'] = this.equipmentRentTime
    if (this.equipmentRentStartDate)
      data['checkin_date'] = formatJoinDate(this.equipmentRentStartDate)
    if (this.VehicleKm) data['kilometer'] = this.VehicleKm
    if (this.serialNumber) data['serial_number'] = this.serialNumber
    if (this.SelectedWhereHosue) data['warehouse_id'] = this.SelectedWhereHosue

    return data
  }

  validate() {
    return EditEquipmentParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditEquipmentParams.validation.validateOrThrow(this)
  }
}
