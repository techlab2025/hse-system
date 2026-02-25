import type Params from '@/base/core/params/params'
import TranslationsParams from '@/base/core/params/translations_params'
import { EquipmentStatus } from '../enum/EquipmentStatus'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

interface Data {
  name: string
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
  data: any[] = []

  public static readonly validation = new ClassValidation().setRules({
    // 'data.equipmentTypeId': { required: true },
  })

  constructor(data: { data: any[] }) {
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
