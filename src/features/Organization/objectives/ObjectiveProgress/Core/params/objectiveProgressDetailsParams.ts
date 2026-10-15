import type Params from '@/base/core/params/params'

export default class ObjectiveProgressDetailsParams implements Params {
  constructor(
    public objectiveId: number,
    public progressId: number,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      objective_id: this.objectiveId,
      objective_progress_id: this.progressId,
    }
  }
}
