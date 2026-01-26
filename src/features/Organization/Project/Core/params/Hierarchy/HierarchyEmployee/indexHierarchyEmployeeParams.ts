import type Params from '@/base/core/params/params'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexLocationHierarchyEmployeeParams implements Params {
  public projectId?: number = 1
  public locationId?: number = 1
  public hierarchyId?: number = 1

  constructor(projectId: number = 1, locationId: number = 1, hierarchyId: number = 1) {
    this.projectId = projectId
    this.locationId = locationId
    this.hierarchyId = hierarchyId
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.projectId || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.projectId)
    if (this.locationId) data['location_id'] = this.locationId
    if (this.hierarchyId) data['hierarchy_id'] = this.hierarchyId

    return data
  }
}
