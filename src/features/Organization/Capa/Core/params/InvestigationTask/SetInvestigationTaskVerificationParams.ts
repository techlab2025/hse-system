import type Params from '@/base/core/params/params'

export default class SetInvestigationTaskVerificationParams implements Params {
  constructor(
    private readonly investigationTaskId: number,
    private readonly verificationMethodology: string,
    private readonly resultFindings: string,
    private readonly verificationStatus: number,
    private readonly capa_id: number
  ) {}

  toMap(): Record<string, string | number> {
    return {
      investigation_task_id: this.investigationTaskId,
      verification_methodology: this.verificationMethodology,
      result_findings: this.resultFindings,
      verification_status: this.verificationStatus,
      observation_capa_id: this.capa_id,
    }
  }
}
