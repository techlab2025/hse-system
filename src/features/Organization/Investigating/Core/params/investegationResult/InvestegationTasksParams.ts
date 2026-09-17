import type Params from '@/base/core/params/params'
import type InvestigationTaskEmployees from './InvestigationTaskEmployeesParams'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

export default class InvestegationTasksParams implements Params {
  public title: string
  public dueDate: string | Date | null
  public investigationTaskEmployees: InvestigationTaskEmployees[]
  public isGoing: number
  constructor(
    title: string,
    dueDate: string | Date | null,
    investigationTaskEmployees: InvestigationTaskEmployees[],
    isGoing: number = 0,
  ) {
    this.title = title
    this.dueDate = dueDate
    this.investigationTaskEmployees = investigationTaskEmployees
    this.isGoing = isGoing
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['title'] = this.title
    data['on_going'] = this.isGoing
    if (!this.isGoing && this.dueDate) {
      data['due_date'] = formatJoinDate(this.dueDate)
    }
    data['investigation_task_employees'] = this.investigationTaskEmployees.map((item) =>
      item.toMap(),
    )

    return data
  }
}
