import type Params from '@/base/core/params/params'

export default class IndexObjectiveProgressParams implements Params {
  constructor(public objectiveId: number) {}

  toMap(): Record<string, unknown> {
    return { objective_id: this.objectiveId }
  }
}
