import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditProjectZoneParams implements Params {
  id: number
  translation: TranslationsParams
  projectId?: number
  lat?: string
  lang?: string
  organizationId?: number

  constructor(
    id: number,
    translation: TranslationsParams,
    projectId?: number,
    lat?: string,
    lang?: string,
    organizationId?: number,
  ) {
    this.id = id
    this.translation = translation
    this.projectId = projectId
    this.lat = lat
    this.lang = lang
    this.organizationId = organizationId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['project_zone_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['project_id'] = this.projectId
    data['lat'] = this.lat
    data['lng'] = this.lang
    data['organization_location_id'] = this.organizationId

    return data
  }
}
