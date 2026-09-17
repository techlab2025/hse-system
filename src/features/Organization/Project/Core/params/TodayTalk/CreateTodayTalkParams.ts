import type Params from '@/base/core/params/params'

export type TodayTalkEmployeeParams = {
  organization_employee_id: number
  is_attend: boolean
}

export default class CreateTodayTalkParams implements Params {
  constructor(
    public readonly projectId: number | undefined,
    public readonly content: string,
    public readonly employees: TodayTalkEmployeeParams[],
    public readonly date: string,
    public readonly time: string,
  ) {}

  toMap(): Record<string, number | string | TodayTalkEmployeeParams[]> {
    const data: Record<string, number | string | TodayTalkEmployeeParams[]> = {
      content: this.content,
      employees: this.employees,
      date: this.date,
      time: this.time,
    }
    if (this.projectId != null) data.project_id = this.projectId
    return data
  }
}
