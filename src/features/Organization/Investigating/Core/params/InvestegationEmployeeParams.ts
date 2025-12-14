import type Params from '@/base/core/params/params'

export default class InvestigatingEmployeeParams implements Params {
  public organization_employee_id: number
  public is_leader: boolean

  constructor(organization_employee_id: number, is_leader: boolean) {
    this.organization_employee_id = organization_employee_id
    this.is_leader = is_leader
  }

  toMap(): Record<
    string,
    | number
    | string
    | any
    | number[]
    | Record<string, string | number[] | number | any | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | any
      | string
      | number[]
      | Record<string, string | number[] | number | any | Record<string, string>>
    > = {}

    if (this.organization_employee_id)
      data['organization_employee_id'] = this.organization_employee_id
    if (this.is_leader) data['is_leader'] = this.is_leader

    return data
  }
}
