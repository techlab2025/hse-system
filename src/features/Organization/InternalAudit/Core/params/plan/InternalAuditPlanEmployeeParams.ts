export default class InternalAuditPlanEmployeeParams {
  constructor(
    public organizationEmployeeId: number,
    public isLeader: boolean = false,
  ) {}

  toMap() {
    return {
      organization_employee_id: this.organizationEmployeeId,
      is_leader: this.isLeader,
    }
  }
}
