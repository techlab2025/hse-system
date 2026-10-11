import type InternalAuditPlanEmployeeParams from './InternalAuditPlanEmployeeParams'

export default class InternalAuditPlanScheduleParams {
  constructor(
    public startTime: string,
    public endTime: string,
    public day: string,
    public auditFocusId: number,
    public location: string,
    public assignedAuditorsId: InternalAuditPlanEmployeeParams[],
  ) {}

  toMap(): Record<string, string | number | Record<string, number>[]> {
    const assignedAuditors = this.assignedAuditorsId
      .map((employee) => employee.toMap())
      .filter((employee) => Object.keys(employee).length > 0)

    return {
      ...(this.startTime.trim() ? { start_time: this.startTime } : {}),
      ...(this.endTime.trim() ? { end_time: this.endTime } : {}),
      ...(this.day.trim() ? { day: this.day } : {}),
      ...(this.auditFocusId > 0 ? { audit_focus_id: this.auditFocusId } : {}),
      ...(this.location.trim() ? { location: this.location.trim() } : {}),
      ...(assignedAuditors.length ? { assigend_auditors: assignedAuditors } : {}),
    }
  }
}
