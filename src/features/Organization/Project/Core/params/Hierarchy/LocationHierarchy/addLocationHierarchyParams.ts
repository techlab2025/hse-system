import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import type LocationHierarchyParams from './locationHierarchyParams';

export default class AddLocationHierarchyParams implements Params {
  projectId: number
  locations: LocationHierarchyParams[]

  constructor(
    projectId: number,
    locations: LocationHierarchyParams[]
  ) {
    this.projectId = projectId
    this.locations = locations
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    data['project_id'] = this.projectId
    data['locations'] = this.locations

    return data
  }
}
