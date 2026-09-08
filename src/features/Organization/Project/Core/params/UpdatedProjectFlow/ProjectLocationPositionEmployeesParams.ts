import type Params from '@/base/core/params/params'

export type ProjectLocationHierarchy = {
  project_location_id: number
  hierarchies: {
    heirarchy_id: number
    organizaion_employees: { organizaion_employee_id: number }[]
  }[]
}

export default class ProjectLocationPositionEmployeesParams implements Params {
  constructor(
    public readonly locations: ProjectLocationHierarchy[],
    public readonly projectId: number,
    public readonly isUpdate: boolean = false,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      locations: this.locations,
    }
  }
}
