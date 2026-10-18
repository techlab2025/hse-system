import type Params from '@/base/core/params/params'

export default class FetchRiskAssessmentsParams implements Params {
  public projectId?: number
  constructor(data: { projectId?: number }) {
    this.projectId = data.projectId
  }

  toMap(): Record<string, any> {
    return {
      project_id: this.projectId!,
    }
  }
}
