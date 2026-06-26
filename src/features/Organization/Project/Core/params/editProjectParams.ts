import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

export default class EditProjectParams implements Params {
  id: number
  translation: TranslationsParams
  partnerId: number[]
  startDate: string
  locationIds: number[]
  zoonIds: number[]
  methodIds: number[]
  endDate: string

  constructor(data: {
    id: number
    translation: TranslationsParams
    partnerId: number[]
    startDate: string
    locationIds: number[]
    zoonIds: number[]
    methodIds: number[]
    endDate: string
  }) {
    this.id = data.id
    this.translation = data.translation
    this.partnerId = data.partnerId
    this.startDate = data.startDate
    this.locationIds = data.locationIds
    this.zoonIds = data.zoonIds
    this.methodIds = data.methodIds
    this.endDate = data.endDate
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

    data['project_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.partnerId?.length > 0) data['contractor_ids'] = this.partnerId
    if (this.startDate) data['start_date'] = formatJoinDate(this.startDate)
    if (this.locationIds?.length > 0) data['location_ids'] = this.locationIds
    if (this.zoonIds?.length > 0) data['zoon_ids'] = this.zoonIds
    if (this.methodIds?.length > 0) data['method_ids'] = this.methodIds
    if (this.endDate) data['end_date'] = formatJoinDate(this.endDate)

    return data
  }
}
