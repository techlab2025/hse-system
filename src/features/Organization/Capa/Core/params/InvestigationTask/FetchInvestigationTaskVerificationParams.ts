import type Params from '@/base/core/params/params'

export default class FetchInvestigationTaskVerificationParams implements Params {
  constructor(
    private readonly investigationTaskId: number,
    private readonly capaId: number | undefined,
    private readonly isInternalAuditTask: boolean = false,
  ) {}

  toMap(): Record<string, string | number> {
    return {
      investigation_task_id: this.investigationTaskId,
      ...(!this.isInternalAuditTask && this.capaId !== undefined
        ? { observation_capa_id: this.capaId }
        : {}),
    }
  }
}
