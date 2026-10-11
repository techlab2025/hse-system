export default class InternalAuditPlanActivityParams {
  constructor(public auditActivityId: number) {}

  toMap(): Record<string, number> {
    return this.auditActivityId > 0 ? { audit_activity_id: this.auditActivityId } : {}
  }
}
