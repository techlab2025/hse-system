import type Params from '@/base/core/params/params'

export default class InjuryParams implements Params {
  public organizationEmployeeId: number
  public employeeName: string
  public note: string
  public injuryTypeId: number
  public isWorkStopped: number
  constructor(
    organizationEmployeeId: number, 
    employeeName: string, 
    note: string, 
    injuryTypeId: number,
    isWorkStopped: number
  ) {
    this.employeeName = employeeName
    this.organizationEmployeeId = organizationEmployeeId
    this.note = note
    this.injuryTypeId = injuryTypeId
    this.isWorkStopped = isWorkStopped
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    if (this.employeeName) data['employee_name'] = this.employeeName
    if (this.organizationEmployeeId) data['organization_employee_id'] = this.organizationEmployeeId
    data['note'] = this.note
    data['injury_type_id'] = this.injuryTypeId
    data['is_work_stopped'] = this.isWorkStopped
    return data
  }
}
