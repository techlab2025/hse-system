import type Params from '@/base/core/params/params'

export default class CreateInternalAuditReportParams implements Params {
  constructor(
    public internalAuditId: number,
    public scope: string,
    public methodology: string,
    public maintenance: string,
    public generalObservations: string,
    public conclusion: string,
    public reportAttachments: string[],
  ) {}

  toMap() {
    return {
      internal_audit_id: this.internalAuditId,
      scopr: this.scope,
      methodology: this.methodology,
      maintenance: this.maintenance,
      general_observations: this.generalObservations,
      conclusion: this.conclusion,
      report_attachments: this.reportAttachments,
    }
  }
}
