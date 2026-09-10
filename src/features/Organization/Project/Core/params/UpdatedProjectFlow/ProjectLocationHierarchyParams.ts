import type Params from '@/base/core/params/params'
import type ProjectHierarchyParams from './hierarchyParams'

export default class ProjectLocationHierarchy implements Params {
  public readonly project_location_id: number
  public readonly hierarchies: ProjectHierarchyParams[]
  public readonly isUpdate: boolean

  constructor(data: {
    project_location_id: number
    hierarchies: ProjectHierarchyParams[]
    isUpdate: boolean
  }) {
    this.project_location_id = data.project_location_id
    this.hierarchies = data.hierarchies
    this.isUpdate = data.isUpdate
  }

  toMap(): Record<string, unknown> {
    return {
      project_location_id: this.project_location_id,
      hierarchies: this.hierarchies.map((el) => el.toMap()),
    }
  }
}
