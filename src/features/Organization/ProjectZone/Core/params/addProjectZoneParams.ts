import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddProjectZoneParams implements Params {
  translation: TranslationsParams
  locationId: number
  serialNumber: string

  // projectId?: number
  // lat?: string
  // lang?: string
  // organizationId?: number

  constructor(
    translation: TranslationsParams,
    locationId?: number,
    serialNumber?: string,
    // lat?: string,
    // lang?: string,
    // organizationId?: number,
  ) {
    this.translation = translation
    this.locationId = locationId
    this.serialNumber = serialNumber
    // this.lat = lat
    // this.lang = lang
    // this.organizationId = organizationId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translation.toMap()
    data['location_id'] = this.locationId
    data['serial_number'] = Number(this.serialNumber)
    // data['lat'] = this.lat
    // data['lng'] = this.lang
    // data['organization_location_id'] = this.organizationId
    return data
  }
}
