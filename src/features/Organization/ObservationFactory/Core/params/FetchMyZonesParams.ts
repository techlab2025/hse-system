import type Params from '@/base/core/params/params'

export default class FetchMyZonesParams implements Params {
  // public projectLocationId?: number
  constructor() // projectLocationId: number
  {
    // this.projectLocationId = projectLocationId
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    // if (this.projectLocationId) data['project_location_id'] = this.projectLocationId
    return data
  }
}
