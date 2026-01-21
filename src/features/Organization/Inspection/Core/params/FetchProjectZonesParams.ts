import type Params from '@/base/core/params/params'

export default class FetchProjectZonesParams implements Params {
  id: number
  ProjectLocationId: number

  constructor(id: number, ProjectLocationId: number) {
    this.id = id
    this.ProjectLocationId = ProjectLocationId
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['project_id'] = this.id
    data['project_location_id'] = this.ProjectLocationId
    return data
  }
}
