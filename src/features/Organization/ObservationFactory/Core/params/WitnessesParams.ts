import type Params from '@/base/core/params/params'

export default class WitnessParams implements Params {
  public employeeName: string
  public note: string
  public organizationEmployeeId: number
  public files?: string[]
  constructor(
    employeeName: string,
    note: string,
    organizationEmployeeId: number,
    files?: string[],
  ) {
    this.employeeName = employeeName
    this.note = note
    this.organizationEmployeeId = organizationEmployeeId
    this.files = files
  }

  toMap(): Record<string, number | string | string[]> {
    const data: Record<string, number | string | string[]> = {}
    if (this.employeeName) data['employee_name'] = this.employeeName
    data['note'] = this.note
    if (this.organizationEmployeeId) data['organization_employee_id'] = this.organizationEmployeeId
    if (this.files) data['files'] = this.files

    return data
  }
}
