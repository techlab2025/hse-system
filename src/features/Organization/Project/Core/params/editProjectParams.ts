import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditProjectParams implements Params {
  id: number
  translation: TranslationsParams
  partnerId: number
  startDate: number
  locationIds: number[]
  zoonIds: number[]
  methodIds: number[]

  constructor(
    id: number,
    translation: TranslationsParams,
    partnerId: number,
    startDate: number,
    locationIds: number[],
    zoonIds: number[],
    methodIds: number[],
  ) {
    this.id = id
    this.translation = translation
    this.partnerId = partnerId
    this.startDate = startDate
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

    data['project_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.partnerId) data['partner_id'] = this.partnerId
    if (this.startDate) data['start_date'] = this.startDate
    if (this.locationIds?.length > 0)
      data['location_ids'] = this.locationIds.map((item) => item?.id)
    if (this.zoonIds?.length > 0) data['zoon_ids'] = this.zoonIds.map((item) => item?.id)
    if (this.methodIds?.length > 0) data['method_ids'] = this.methodIds.map((item) => item?.id)

    return data
  }
}
