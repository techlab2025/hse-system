import type Params from '@/base/core/params/params'

export default class LeadershipPlanVisitParams implements Params {
  public date: string
  public location: string
  public orgnizationEmployeeIds: number[]
  public visitActivityIds: number[]

  constructor(
    date: string,
    location: string,
    orgnizationEmployeeIds: number[],
    visitActivityIds: number[],
  ) {
    this.date = date
    this.location = location
    this.orgnizationEmployeeIds = orgnizationEmployeeIds
    this.visitActivityIds = visitActivityIds
  }

  toMap(): Record<string, unknown> {
    return {
      date: this.date,
      location: this.location,
      organization_employees: this.orgnizationEmployeeIds.map((id) => ({
        organization_employee_id: id,
      })),
      visit_activity: this.visitActivityIds.map((id) => ({ visit_activity_id: id })),
    }
  }
}
