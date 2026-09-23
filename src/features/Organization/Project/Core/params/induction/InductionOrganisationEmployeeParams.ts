import type Params from '@/base/core/params/params'

export default class InductionOrganisationEmployee implements Params {
  constructor(
    public organisation_employee_id?: number | null,
    public name?: string | null,
  ) {}

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    const employeeId = Number(this.organisation_employee_id)
    const employeeName = this.name?.trim()

    if (Number.isFinite(employeeId) && employeeId > 0) {
      data.organisation_employee_id = employeeId
      return data
    }

    if (employeeName) data.name = employeeName
    return data
  }
}
