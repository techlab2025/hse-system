import type Params from '@/base/core/params/params'
import type ProjectLocationHierarchy from './ProjectLocationHierarchyParams'

export default class ProjectLocationPositionEmployeesParams implements Params {
  public readonly locations: ProjectLocationHierarchy[]
  public readonly projectId: number
  public readonly isUpdate: boolean

  constructor(data: {
    locations: ProjectLocationHierarchy[]
    projectId: number
    isUpdate: boolean
  }) {
    this.locations = data.locations
    this.projectId = data.projectId
    this.isUpdate = data.isUpdate
  }

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      locations: this.locations,
    }
  }
}
