import type Params from '@/base/core/params/params'

export default class ShowProjectSummaryDetailsParams implements Params {
  constructor(public readonly projectId: number) {}

  toMap(): Record<string, number> {
    return {
      project_id: this.projectId,
    }
  }
}
