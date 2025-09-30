import type Params from '@/base/core/params/params'
// import AttentionParams from "@/features/users/clients/Core/params/attention_params";
// import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type LocationModel from '@/features/setting/Location/Data/models/LocationModel'

export default class EditOrganizationLocationParams implements Params {
  id: number
  translation: TranslationsParams
  lat: number
  lng: number
  location_id: number

  constructor(
    id: number,
    translation: TranslationsParams,
    lat: number,
    lng: number,
    location_id: number
  ) {
    this.id = id
    this.translation = translation
    this.lat = lat
    this.lng = lng
    this.location_id = location_id
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

    data['organization_location_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['lat'] = this.lat
    data['lng'] = this.lng
    if (this.location_id) data['location_id'] = this.location_id

    return data
  }
}
