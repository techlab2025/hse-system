import type Params from '@/base/core/params/params'

export default class FetchInternalAuditReportParams implements Params {
  constructor(public internalAuditPlanId: number) {}

  toMap(): Record<string, number> {
    return { internal_audit_plan_id: this.internalAuditPlanId }
  }
}
