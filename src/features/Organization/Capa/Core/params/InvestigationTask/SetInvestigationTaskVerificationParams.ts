import type Params from '@/base/core/params/params'

export default class SetInvestigationTaskVerificationParams implements Params {
  constructor(
    private readonly investigationTaskId: number,
    private readonly verificationMethodology: string,
    private readonly resultFindings: string,
    private readonly verificationStatus: number,
  ) {}

  toMap(): Record<string, string | number> {
    return {
      investigation_task_id: this.investigationTaskId,
      verification_methodology: this.verificationMethodology,
      result_findings: this.resultFindings,
      verification_status: this.verificationStatus,
    }
  }
}
