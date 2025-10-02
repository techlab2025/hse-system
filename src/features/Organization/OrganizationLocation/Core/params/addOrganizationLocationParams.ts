import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddOrganizationLocationParams implements Params {
  translation: TranslationsParams
  
  lat: number
  lng: number
  location_id: number
  constructor(
    translation: TranslationsParams,
    lat: number,
    lng: number,
    location_id: number

  ) {
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

    data['translations'] = this.translation.toMap()
    data['lat'] = this.lat
    data['lng'] = this.lng
    if (this.location_id) data['location_id'] = this.location_id

    return data
  }
}
