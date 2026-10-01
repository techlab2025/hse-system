export default class InternalAuditEmployeeParams {
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
