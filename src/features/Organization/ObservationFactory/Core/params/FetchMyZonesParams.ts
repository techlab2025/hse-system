import type Params from '@/base/core/params/params'

export default class FetchMyZonesParams implements Params {
  public projectId?: number
  constructor(projectId?: number) {
    // projectLocationId: number
    this.projectId = projectId
  }

  toMap(): Record<string, number | string | number[]> {
    const data: Record<string, number | string | number[]> = {}
    if (this.projectId) data['project_id'] = this.projectId
    return data
  }
}
