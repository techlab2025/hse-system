export default class InternalAuditPlanScheduleParams {
  constructor(
    public startTime: string,
    public endTime: string,
    public day: string,
    public auditFocusId: number,
    public location: string,
    public assignedAuditorsId: number,
  ) {}

  toMap(): Record<string, string | number> {
    return {
      ...(this.startTime.trim() ? { start_time: this.startTime } : {}),
      ...(this.endTime.trim() ? { end_time: this.endTime } : {}),
      ...(this.day.trim() ? { day: this.day } : {}),
      ...(this.auditFocusId > 0 ? { audit_focus_id: this.auditFocusId } : {}),
      ...(this.location.trim() ? { location: this.location.trim() } : {}),
      ...(this.assignedAuditorsId > 0
        ? { assigend_auditors_id: this.assignedAuditorsId }
        : {}),
    }
  }
}
