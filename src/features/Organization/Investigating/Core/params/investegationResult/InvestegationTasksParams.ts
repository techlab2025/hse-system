import type Params from '@/base/core/params/params'
import type InvestigationTaskEmployees from './InvestigationTaskEmployeesParams'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

export default class InvestegationTasksParams implements Params {
  public title: string
  public dueDate: string
  public investigationTaskEmployees: InvestigationTaskEmployees[]
  constructor(
    title: string,
    dueDate: string,
    investigationTaskEmployees: InvestigationTaskEmployees[],
  ) {
    this.title = title
    this.dueDate = dueDate
    this.investigationTaskEmployees = investigationTaskEmployees
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['title'] = this.title
    data['due_date'] = formatJoinDate(this.dueDate)
    data['investigation_task_employees'] = this.investigationTaskEmployees

    return data
  }
}
