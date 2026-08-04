import type Params from '@/base/core/params/params'

export type TodayTalkEmployeeParams = {
  organization_employee_id: number
  is_attend: boolean
}

export default class CreateTodayTalkParams implements Params {
  constructor(
    public readonly projectId: number,
    public readonly content: string,
    public readonly employees: TodayTalkEmployeeParams[],
  ) {}

  toMap(): Record<string, number | string | TodayTalkEmployeeParams[]> {
    return {
      project_id: this.projectId,
      content: this.content,
      employees: this.employees,
    }
  }
}
