import type Params from '@/base/core/params/params'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class FetchProjectZonesParams implements Params {
  id: number
  ProjectLocationId: number

  constructor(id: number, ProjectLocationId: number) {
    this.id = id
    this.ProjectLocationId = ProjectLocationId
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
       if (this.id || useProjectSelectStore().getProjectId())
         data['project_id'] = useProjectSelectStore().SelectedProjectId(this.id)
    data['project_location_id'] = this.ProjectLocationId
    return data
  }
}
