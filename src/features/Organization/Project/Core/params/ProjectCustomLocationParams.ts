import type Params from '@/base/core/params/params'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class ProjectCustomLocationParams implements Params {
  id: number
  type: number[]
  projectLocationIds?: number[]
  constructor(id: number, type: number[], projectLocationIds?: number[]) {
    this.id = id
    this.type = type
    this.projectLocationIds = projectLocationIds
  }

  toMap(): Record<string, number | number[]> {
    const data: Record<string, number | number[]> = {}
    if (this.id || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.id)
    data['type'] = this.type
    if (this.projectLocationIds) data['project_location_ids'] = this.projectLocationIds
    return data
  }
}
