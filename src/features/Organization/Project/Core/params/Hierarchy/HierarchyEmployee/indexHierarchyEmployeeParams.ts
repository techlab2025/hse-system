import type Params from '@/base/core/params/params'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexLocationHierarchyEmployeeParams implements Params {
  public projectId?: number
  public locationId?: number = 1
  public hierarchyId?: number | null
  public isLeader?: boolean

  constructor(
    projectId?: number,
    locationId: number = 1,
    hierarchyId?: number | null,
    isLeader?: boolean,
  ) {
    this.projectId = projectId
    this.locationId = locationId
    this.hierarchyId = hierarchyId
    this.isLeader = isLeader
  }

  toMap(): Record<string, string | number | number[] | null | boolean> {
    const data: Record<string, string | number | number[] | null | boolean> = {}
    if (this.projectId || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.projectId)
    if (this.locationId) data['location_id'] = this.locationId
    if (this.hierarchyId) data['hierarchy_id'] = this.hierarchyId
    if (this.isLeader != null) data['is_leader'] = this.isLeader

    return data
  }
}
