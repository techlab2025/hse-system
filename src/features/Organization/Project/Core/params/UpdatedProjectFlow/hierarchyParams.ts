import type Params from '@/base/core/params/params'
import type ProjectEmployeeParams from './projectEmployeeParams'


export default class ProjectHierarchyParams implements Params {
  public readonly hierarchy_id: number
  public readonly organizaion_employees: ProjectEmployeeParams[]

  constructor(data: { hierarchy_id: number; organizaion_employees: ProjectEmployeeParams[] }) {
    this.hierarchy_id = data.hierarchy_id
    this.organizaion_employees = data.organizaion_employees
  }

  toMap(): Record<string, unknown> {
    return {
      hierarchy_id: this.hierarchy_id,
      organizaion_employees: this.organizaion_employees.map((el) => el.toMap()),
    }
  }
}
