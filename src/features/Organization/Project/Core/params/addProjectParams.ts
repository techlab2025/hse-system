import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
export default class AddProjectParams implements Params {
  translation: TranslationsParams
  ContractorIds: number[]
  startDate: string
  SerialNumber: string
  locationIds: number[]
  zoonIds: number[]
  methodIds: number[]
  constructor(data: {
    translation: TranslationsParams
    ContractorIds: number[]
    startDate: string
    SerialNumber: string
    locationIds: number[]
    zoonIds: number[]
    methodIds: number[]
  }) {
    this.translation = data.translation
    this.ContractorIds = data.ContractorIds
    this.startDate = data.startDate
    this.SerialNumber = data.SerialNumber
    this.locationIds = data.locationIds
    this.zoonIds = data.zoonIds
    this.methodIds = data.methodIds
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
    data['contractor_ids'] = this.ContractorIds.map((id) => id)
    if (this.startDate) data['start_date'] = formatJoinDate(this.startDate)
    if (this.SerialNumber) data['serial_number'] = Number(this.SerialNumber)
    if (this.locationIds?.length > 0) data['location_ids'] = this.locationIds
    if (this.zoonIds?.length > 0) data['zoon_ids'] = this.zoonIds
    if (this.methodIds?.length > 0) data['method_ids'] = this.methodIds
    return data
  }
}