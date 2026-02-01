import type Params from '@/base/core/params/params'
import type MeetingParams from './MeetingParams'
import type InvestigatingEmployeeParams from './InvestegationEmployeeParams'

export default class AddInvestigatingParams implements Params {
  public observationId: number
  public employees: InvestigatingEmployeeParams[]
  public meetings: MeetingParams | null

  constructor(data: {
    observationId: number
    employees: InvestigatingEmployeeParams[]
    meetings: MeetingParams | null
  }) {
    this.observationId = data.observationId
    this.employees = data.employees
    this.meetings = data.meetings
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

    if (this.observationId) data['investigation_id'] = this.observationId
    if (this.employees) data['employees'] = this.employees
    if (this.meetings != null) data['meeting'] = this.meetings

    return data
  }
}
