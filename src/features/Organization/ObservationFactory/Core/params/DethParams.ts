import type Params from '@/base/core/params/params'

export default class DethParams implements Params {
  public employeeName: string
  public note: string
  public organizationEmployeeId: number
  public img: any[]
  constructor(employeeName: string, note: string, organizationEmployeeId: number, img: any[]) {
    this.employeeName = employeeName
    this.note = note
    this.organizationEmployeeId = organizationEmployeeId
    this.img = img
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    if (this.note) data['note'] = this.note
    if (this.organizationEmployeeId) data['organization_employee_id'] = this.organizationEmployeeId
    if (!this.organizationEmployeeId && this.employeeName) data['employee_name'] = this.employeeName
    if (this.img?.length) data['files'] = this.img

    return data
  }
}
