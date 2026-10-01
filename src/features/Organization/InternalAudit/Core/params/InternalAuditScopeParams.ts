import type InternalAuditActivityParams from './InternalAuditActivityParams'

export default class InternalAuditScopeParams {
  constructor(
    public departmentId: number,
    public auditActivities: InternalAuditActivityParams[],
  ) {}

  toMap() {
    return {
      depertment_id: this.departmentId,
      audit_activitys: this.auditActivities.map((activity) => activity.toMap()),
    }
  }
}
