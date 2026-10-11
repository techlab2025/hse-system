import type InternalAuditPlanActivityParams from './InternalAuditPlanActivityParams'

export default class InternalAuditPlanScopeParams {
  constructor(
    public departmentId: number,
    public auditActivities: InternalAuditPlanActivityParams[],
  ) {}

  toMap(): Record<string, unknown> {
    const activities = this.auditActivities
      .map((activity) => activity.toMap())
      .filter((activity) => Object.keys(activity).length > 0)

    return {
      ...(this.departmentId > 0 ? { department_id: this.departmentId } : {}),
      ...(activities.length ? { audit_activities: activities } : {}),
    }
  }
}
