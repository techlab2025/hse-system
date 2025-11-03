import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'

export default class AddLocationHierarchyParams implements Params {
  project_id: number
  locations: { project_location_id: number; hierarchy_ids: number[] }[]

  constructor(
    project_id: number,
    locations: { project_location_id: number; hierarchy_ids: number[] }[]
  ) {
    this.project_id = project_id
    this.locations = locations
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    data['project_id'] = this.project_id
    data['locations'] = this.locations

    return data
  }
}
