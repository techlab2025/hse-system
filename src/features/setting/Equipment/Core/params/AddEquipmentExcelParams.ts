import type Params from '@/base/core/params/params'
import TranslationsParams from '@/base/core/params/translations_params'
import { EquipmentStatus } from '../enum/EquipmentStatus'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

interface Data {
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
}
export default class AddEquipmentExcelParams implements Params {
  data: Data[] = []

  public static readonly validation = new ClassValidation().setRules({
    // translation: { required: true, minLength: 2, maxLength: 100 },
    // equipmentTypeId: { required: true },
    // equipmentRentStartDate: { required: true },
  })

  constructor(data: { data: Data[] }) {
    Object.assign(this, data)
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}

    data['equipments_data'] = this.data

    return data
  }

  validate() {
    return AddEquipmentExcelParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddEquipmentExcelParams.validation.validateOrThrow(this)
  }
}
