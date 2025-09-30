import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddProjectZoneParams implements Params {
  translation: TranslationsParams
  projectId?: number
  lat?: string
  lang?: string
  organizationId?: number

  constructor(
    translation: TranslationsParams,
    projectId?: number,
    lat?: string,
    lang?: string,
    organizationId?: number,
  ) {
    this.translation = translation
    this.projectId = projectId
    this.lat = lat
    this.lang = lang
    this.organizationId = organizationId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translation.toMap()
    data['project_id'] = this.projectId
    data['lat'] = this.lat
    data['lng'] = this.lang
    data['organization_location_id'] = this.organizationId
    return data
  }
}
