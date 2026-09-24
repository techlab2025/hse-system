import type Params from '@/base/core/params/params'

export interface LeadershipVisitInput {
  date: string
  location: string
  orgnizationEmployeeId: number
  visitActivityId: number
}

export default class CreateLeadershipPlanParams implements Params {
  constructor(
    public projectId: number,
    // public monthNumber: number,
    public visits: LeadershipVisitInput[],
  ) {}

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      // month_number: this.monthNumber,
      visits: this.visits.map((visit) => ({
        date: visit.date,
        location: visit.location,
        orgnization_employee_id: visit.orgnizationEmployeeId,
        visit_activity_id: visit.visitActivityId,
      })),
    }
  }
}
