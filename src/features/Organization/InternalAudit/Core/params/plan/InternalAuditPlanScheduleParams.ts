export default class InternalAuditPlanScheduleParams {
  constructor(
    public startTime: string,
    public endTime: string,
    public day: string,
    public auditFocusId: number,
    public location: string,
    public assignedAuditorsId: number,
  ) {}

  toMap() {
    return {
      start_time: this.startTime,
      end_time: this.endTime,
      day: this.day,
      audit_focus_id: this.auditFocusId,
      location: this.location,
      assigend_auditors_id: this.assignedAuditorsId,
    }
  }
}
