import type Params from '@/base/core/params/params.ts'
import type InvestigatingEmployeeParams from './InvestegationEmployeeParams'
import type MeetingParams from './MeetingParams'

export default class EditInvestigatingParams implements Params {
  public id: number
  public observationId: number
  public employees: InvestigatingEmployeeParams[]
  public meetings: MeetingParams | null
  constructor(data: {
    id: number
    observationId: number
    employees: InvestigatingEmployeeParams[]
    meetings: MeetingParams | null
  }) {
    this.id = data.id
    this.observationId = data.observationId
    this.employees = data.employees
    this.meetings = data.meetings
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['observation_id'] = this.id
    if (this.observationId) data['investigation_id'] = this.observationId
    if (this.employees) data['employees'] = this.employees
    if (this.meetings != null) data['meetings'] = this.meetings
    return data
  }
}
