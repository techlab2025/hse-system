import type Params from '@/base/core/params/params'
import type LocationHierarchyEmployeeParams from './locationHierarchyEmployeeParams'

export default class AddHierarchyEmployeeParams implements Params {
  projectId: number
  locations: LocationHierarchyEmployeeParams[]

  constructor(projectId: number, locations: LocationHierarchyEmployeeParams[]) {
    this.projectId = projectId
    this.locations = locations
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    if (this.locations != null) data['project_id'] = this.projectId
    if (this.locations != null) data['locations'] = this.locations
    return data
  }
}
