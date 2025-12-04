import type Params from '@/base/core/params/params'

export default class InvestigationEmployeesParams implements Params {
  public OrganizationEmployeeId: number
  public isLeader: boolean
  constructor(OrganizationEmployeeId: number, isLeader: boolean) {
    this.OrganizationEmployeeId = OrganizationEmployeeId
    this.isLeader = isLeader
  }

  toMap(): Record<string, number | string | boolean> {
    const data: Record<string, number | string | boolean> = {}
    data['organization_employee_id'] = this.OrganizationEmployeeId
    data['is_leader'] = this.isLeader
    return data
  }
}
