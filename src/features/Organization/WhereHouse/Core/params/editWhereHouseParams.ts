import type Params from '@/base/core/params/params'

export default class EditWhereHouseParams implements Params {
  warehouseId: number
  warehouseTypeId: number
  name: string
  serialNumber: number

  constructor(warehouseId: number, warehouseTypeId: number, name: string, serialNumber: number) {
    this.warehouseId = warehouseId
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
    data['warehouse_id'] = this.warehouseId
    data['warehouse_type_id'] = this.warehouseTypeId
    data['name'] = this.name
    data['serial_number'] = Number(this.serialNumber)
    return data
  }
}
