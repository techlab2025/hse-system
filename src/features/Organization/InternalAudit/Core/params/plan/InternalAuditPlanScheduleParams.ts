export default class InternalAuditPlanScheduleParams {
  constructor(
    public startTime: string,
    public endTime: string,
    public day: string,
    public auditFocusId: number,
    public location: string,
    public assignedAuditorsId: number,
    public generalInstructions: string,
    public attachments: string[],
  ) {}

  toMap() {
    return {
      start_time: this.startTime,
      end_time: this.endTime,
      day: this.day,
      audit_foucse_id: this.auditFocusId,
      location: this.location,
      assigend_auditors_id: this.assignedAuditorsId,
      general_instructions: this.generalInstructions,
      attachments: this.attachments,
    }
  }
}
