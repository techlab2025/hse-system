import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import type { EquipmentStatus } from '../enum/EquipmentStatus'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddEquipmentParams implements Params {
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
  equipmentRentEndDate: string
  VehicleKm: string
  serialNumber: string
  SelectedWhereHosue: number

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
    equipmentTypeId: { required: true },
  })

  constructor(data: {
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
    equipmentRentEndDate: string
    VehicleKm: string
    serialNumber: string
    SelectedWhereHosue: number
  }) {
    Object.assign(this, data)
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}

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

    if (this.constructorId != null) data['constructor_id'] = this.constructorId

    if (this.description) data['description'] = this.description
    if (this.equipmentRentType) data['period_type'] = this.equipmentRentType
    if (this.equipmentRentTime) data['period'] = this.equipmentRentTime
    if (this.equipmentRentStartDate) data['checkin_date'] = this.equipmentRentStartDate
    if (this.equipmentRentEndDate) data['checkout_date'] = this.equipmentRentEndDate
    if (this.VehicleKm) data['kilometer'] = this.VehicleKm
    if (this.serialNumber) data['serial'] = this.serialNumber
    if (this.SelectedWhereHosue) data['warehouse'] = this.SelectedWhereHosue

    return data
  }

  validate() {
    return AddEquipmentParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddEquipmentParams.validation.validateOrThrow(this)
  }
}
