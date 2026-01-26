import type Params from '@/base/core/params/params'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class FetchMyZonesParams implements Params {
  public projectId?: number
  constructor(projectId?: number) {
    // projectLocationId: number
    this.projectId = projectId
  }

  toMap(): Record<string, number | string | number[]> {
    const data: Record<string, number | string | number[]> = {}
    if (this.projectId || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.projectId)
    return data
  }
}
