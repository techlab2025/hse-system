import type Params from '@/base/core/params/params'

export default class FetchAllLeadershipVisitsParams implements Params {
  constructor(public projectId: number) {}

  toMap(): Record<string, number> {
    return { project_id: this.projectId }
  }
}
