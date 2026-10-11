export default class InternalAuditPlanEmployeeParams {
  constructor(public organizationEmployeeId: number) {}

  toMap(): Record<string, number> {
    return this.organizationEmployeeId > 0
      ? { organization_employee_id: this.organizationEmployeeId }
      : {}
  }
}
