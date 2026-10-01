import type InternalAuditPlanActivityParams from './InternalAuditPlanActivityParams'

export default class InternalAuditPlanScopeParams {
  constructor(
    public departmentId: number,
    public auditActivities: InternalAuditPlanActivityParams[],
  ) {}

  toMap() {
    return {
      depertment_id: this.departmentId,
      audit_activitys: this.auditActivities.map((activity) => activity.toMap()),
    }
  }
}
