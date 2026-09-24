import type Params from '@/base/core/params/params'
import type LeadershipPlanVisitParams from './LeadershipPlanVisitParams'

export default class CreateLeadershipPlanParams implements Params {
  constructor(
    public projectId: number,
    public visits: LeadershipPlanVisitParams[],
  ) {}

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      visit: this.visits.map((el) => el.toMap()),
    }
  }
}

