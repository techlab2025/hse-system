import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditProjectZoneParams implements Params {
  id: number
  translation: TranslationsParams
  locationId?: number

  constructor(id: number, translation: TranslationsParams, locationId?: number) {
    this.id = id
    this.translation = translation
    this.locationId = locationId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['zoon_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['location_id'] = this.locationId

    return data
  }
}
