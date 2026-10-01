export default class InternalAuditPlanActivityParams {
  constructor(public auditActivityId: number) {}

  toMap() {
    return { audit_activity_id: this.auditActivityId }
  }
}
