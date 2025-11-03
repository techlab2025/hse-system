import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddProjectParams implements Params {
  translation: TranslationsParams
  partnerId: number
  startDate: string
  SerialNumber: string
  locationIds: number[]
  zoonIds: number[]
  methodIds: number[]

  constructor(
    translation: TranslationsParams,
    partnerId: number,
    startDate: string,
    SerialNumber: string,
    locationIds: number[],
    zoonIds: number[],
    methodIds: number[],
  ) {
    this.translation = translation
    this.partnerId = partnerId
    this.startDate = startDate
    this.SerialNumber = SerialNumber
    this.locationIds = locationIds
    this.zoonIds = zoonIds
    this.methodIds = methodIds
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
    if (this.partnerId) data['partner_id'] = this.partnerId
    if (this.startDate) data['start_date'] = formatJoinDate(this.startDate)
    if (this.SerialNumber) data['serial_number'] = this.SerialNumber
    if (this.locationIds?.length > 0) data['location_ids'] = this.locationIds
    if (this.zoonIds?.length > 0) data['zoon_ids'] = this.zoonIds
    if (this.methodIds?.length > 0) data['method_ids'] = this.methodIds

    return data
  }
}
