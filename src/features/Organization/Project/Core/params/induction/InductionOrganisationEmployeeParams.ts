import type Params from '@/base/core/params/params'

export default class InductionOrganisationEmployee implements Params {
  constructor(
    public organisation_employee_id?: number,
    public name?: string,
  ) {}

  toMap(): Record<string, number | string | undefined> {
    const data: Record<string, number | string | undefined> = {
      organisation_employee_id: this.organisation_employee_id,
    }
    if (this.name) data.name = this.name
    return data
  }
}
