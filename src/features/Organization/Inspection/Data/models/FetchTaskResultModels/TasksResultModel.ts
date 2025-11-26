import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import TaskResultItemModel from './ItemTasksResultModel'

export default class TaskResultModel {
  public id: number
  public date: string
  public status: number
  public employee: OrganizatoinEmployeeModel
  public taskResultItems: TaskResultItemModel[]

  constructor(
    id: number,
    date: string,
    status: number,
    employee: OrganizatoinEmployeeModel,
    taskResultItems: TaskResultItemModel[],
  ) {
    this.id = id
    this.date = date
    this.status = status
    this.employee = employee
    this.taskResultItems = taskResultItems
  }

  static fromMap(data: any): TaskResultModel {
    return new TaskResultModel(
      data.id,
      data.date,
      data.status,
      OrganizatoinEmployeeModel.fromMap(data.employee),
      data.task_result_items?.map((i: any) => TaskResultItemModel.fromMap(i)) ?? [],
    )
  }
}
