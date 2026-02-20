import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import TaskResultItemModel from './ItemTasksResultModel'
import TemplateItemTagModel from '@/features/setting/Template/Data/models/TemplateItemTagModel'

export default class TaskResultModel {
  public id: number
  public date: string
  public status: number
  public employee: OrganizatoinEmployeeModel
  public taskResultItems: TaskResultItemModel[]
  public time: string
  public templateItemTags: TemplateItemTagModel[]

  constructor(
    id: number,
    date: string,
    status: number,
    employee: OrganizatoinEmployeeModel,
    taskResultItems: TaskResultItemModel[],
    time: string,
    templateItemTags: TemplateItemTagModel[],
  ) {
    this.id = id
    this.date = date
    this.status = status
    this.employee = employee
    this.taskResultItems = taskResultItems
    this.time = time
    this.templateItemTags = templateItemTags
  }

  static fromMap(data: any): TaskResultModel {
    return new TaskResultModel(
      data.id,
      data.date,
      data.status,
      OrganizatoinEmployeeModel?.fromMap(data?.created_by),
      data.task_result_items?.map((i: any) => TaskResultItemModel.fromMap(i)) ?? [],
      data.time,
      data.template_item_tags?.map((el: any) => TemplateItemTagModel.fromMap(el)),
    )
  }
  static example: TaskResultModel[] = [
    new TaskResultModel(1, '2026-01-01', 1, OrganizatoinEmployeeModel.example, [
      TaskResultItemModel.example,
    ]),
  ]
}
