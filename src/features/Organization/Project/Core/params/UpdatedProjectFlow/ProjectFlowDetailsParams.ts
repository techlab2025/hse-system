import type Params from '@/base/core/params/params'

export default class ProjectFlowDetailsParams implements Params {
  public readonly projectId: number

  constructor(data: { projectId: number }) {
    this.projectId = data.projectId
  }

  toMap(): Record<string, number> {
    return { project_id: this.projectId }
  }
}
