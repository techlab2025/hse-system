import type Params from '@/base/core/params/params'
import type InvestigationEmployeesParams from '../InvestigationEmployeesParams'

export default class AddInvestigationResultParams implements Params {
  public observationId: number
  public date: string
  public hasEmployee: boolean
  public Employees: InvestigationEmployeesParams
  constructor(
    observationId: number,
    date: string,
    hasEmployee: boolean,
    Employees: InvestigationEmployeesParams,
  ) {
    this.observationId = observationId
    this.date = date
    this.hasEmployee = hasEmployee
    this.Employees = Employees
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['observation_id'] = this.observationId
    data['date'] = this.date
    data['has_employee'] = this.hasEmployee
    data['employees'] = this.Employees.toMap()

    return data
  }
}
