import type Params from '@/base/core/params/params'

export default class LeadershipPlanVisitParams implements Params {
  public date: string
  public location: string
  public orgnizationEmployeeId: number
  public visitActivityId: number

  constructor(
    date: string,
    location: string,
    orgnizationEmployeeId: number,
    visitActivityId: number,
  ) {
    this.date = date
    this.location = location
    this.orgnizationEmployeeId = orgnizationEmployeeId
    this.visitActivityId = visitActivityId
  }

  toMap(): Record<string, unknown> {
    return {
      date: this.date,
      location: this.location,
      orgnization_employee_id: this.orgnizationEmployeeId,
      visit_activity_id: this.visitActivityId,
    }
  }
}
