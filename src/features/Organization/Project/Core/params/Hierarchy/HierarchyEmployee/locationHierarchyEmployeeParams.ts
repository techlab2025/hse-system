import type Params from '@/base/core/params/params'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class LocationHierarchyEmployeeParams implements Params {
  public project_location_hierarchy_id: number = 1
  public employee_ids: number[]

  constructor(project_location_hierarchy_id: number = 1, employee_ids: number[]) {
    this.project_location_hierarchy_id = project_location_hierarchy_id
    this.employee_ids = employee_ids
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    data['project_location_hierarchy_id'] = this.project_location_hierarchy_id
    data['employee_ids'] = this.employee_ids || []

    return data
  }
}
