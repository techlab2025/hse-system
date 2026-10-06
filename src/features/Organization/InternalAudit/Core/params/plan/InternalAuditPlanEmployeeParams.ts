export default class InternalAuditPlanEmployeeParams {
  constructor(public organizationEmployeeId: number) {}

  toMap(): Record<string, number> {
    return this.organizationEmployeeId > 0
      ? { assigend_auditors_id: this.organizationEmployeeId }
      : {}
  }
}
