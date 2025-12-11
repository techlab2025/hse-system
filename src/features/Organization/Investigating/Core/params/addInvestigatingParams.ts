import type Params from '@/base/core/params/params'
import type MeetingParams from './MeetingParams'


export default class AddInvestigatingParams implements Params {
  public observationId: number
  // public date: string
  public employees: Employee[]
  public meetings: MeetingParams

  constructor(
    observationId: number,
    // date: string ,
    employees: Employee[],
    meetings: MeetingParams,
  ) {
    this.observationId = observationId
    // this.date = date
    this.employees = employees
    this.meetings = meetings
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | any | Record<string, string>>
    > = {}

    if (this.observationId) data['observation_id'] = this.observationId
    // if (this.date) data['date'] = this.date
    if (this.employees) data['employees'] = this.employees
    if (this.meetings) data['meetings'] = this.meetings

    return data
  }
}
interface Employee {
  organization_employee_id: number
  is_leader: boolean
}

