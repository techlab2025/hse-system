import type Params from '@/base/core/params/params'

export default class FetchInvestigationTaskVerificationParams implements Params {
  constructor(
    private readonly investigationTaskId: number,
    private readonly capaId: number,
    private readonly isInternalAuditTask: boolean = false,
  ) {}

  toMap(): Record<string, string | number> {
    return {
      [this.isInternalAuditTask ? 'internal_audit_ncr_task_id' : 'investigation_task_id']:
        this.investigationTaskId,
      observation_capa_id: this.capaId,
    }
  }
}
