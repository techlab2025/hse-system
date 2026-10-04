import type InternalAuditPlanActivityParams from './InternalAuditPlanActivityParams'

export default class InternalAuditPlanScopeParams {
  constructor(
    public departmentId: number,
    public auditActivities: InternalAuditPlanActivityParams[],
  ) {}

  toMap() {
    return {
      department_id: this.departmentId,
      audit_activities: this.auditActivities.map((activity) => activity.toMap()),
    }
  }
}
