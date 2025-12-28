import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddWhereHouseParams implements Params {
  warehouseTypeId: number
  name: string
  serialNumber: number

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
  })

  constructor(warehouseTypeId: number, name: string, serialNumber: number) {
    this.warehouseTypeId = warehouseTypeId
    this.name = name
    this.serialNumber = serialNumber
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

    data['warehouse_type_id'] = this.warehouseTypeId
    data['name'] = this.name
    data['serial_number'] = this.serialNumber

    return data
  }

  validate() {
    return AddWhereHouseParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddWhereHouseParams.validation.validateOrThrow(this)
  }
}
