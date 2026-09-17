import type Params from '@/base/core/params/params'

export default class FetchInvestigationTaskVerificationParams implements Params {
  constructor(
    private readonly investigationTaskId: number,
    private readonly capaId: number,
  ) {}

  toMap(): Record<string, string | number> {
    return {
      investigation_task_id: this.investigationTaskId,
      observation_capa_id: this.capaId,
    }
  }
}
