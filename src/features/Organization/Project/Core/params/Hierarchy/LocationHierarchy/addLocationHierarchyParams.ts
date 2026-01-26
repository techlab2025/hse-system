import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'
import type LocationHierarchyParams from './locationHierarchyParams'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class AddLocationHierarchyParams implements Params {
  projectId: number
  locations: LocationHierarchyParams[]

  constructor(projectId: number, locations: LocationHierarchyParams[]) {
    this.projectId = projectId
    this.locations = locations
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    if (this.projectId || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.projectId)
    data['locations'] = this.locations

    return data
  }
}
