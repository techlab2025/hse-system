import type Params from '@/base/core/params/params'

export default class FetchPPEActivityToolsParams implements Params {
  public ppeActivityId?: number
  public projectId?: number | null
  constructor(data: { ppeActivityId?: number; projectId?: number | null } = {}) {
    this.projectId = data.projectId
    this.ppeActivityId = data.ppeActivityId
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    if (this.ppeActivityId != null) data.ppe_activity_id = this.ppeActivityId
    if (this.projectId != null) data.project_id = this.projectId
    return data
  }
}
