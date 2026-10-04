export default class InternalAuditPlanEmployeeParams {
  constructor(public organizationEmployeeId: number) {}

  toMap() {
    return {
      organization_employee_id: this.organizationEmployeeId,
    }
  }
}
