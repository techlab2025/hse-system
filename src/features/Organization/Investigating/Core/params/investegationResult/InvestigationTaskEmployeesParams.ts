import type Params from '@/base/core/params/params'

export default class InvestigationTaskEmployees implements Params {
  public organizationEmployeeId?: number
  public employeeName?: string
  public organizationEmployeeFollowId?: string

  constructor(
    organizationEmployeeId?: number,
    employeeName?: string,
    organizationEmployeeFollowId?: string,
  ) {
    this.organizationEmployeeId = organizationEmployeeId
    this.employeeName = employeeName
    this.organizationEmployeeFollowId = organizationEmployeeFollowId
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['organization_employee_id'] = this.organizationEmployeeId
    data['employee_name'] = this.employeeName
    data['organization_employee_follow_id'] = this.organizationEmployeeFollowId

    return data
  }
}
