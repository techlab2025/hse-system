import type Params from '@/base/core/params/params.ts'
import type ItemResultParams from './ItemResultParams'

export default class CreateTaskResultParams implements Params {
  public taskId: number
  public templateId: number
  public taskResultItems: ItemResultParams[]
  public permitId?: number

  constructor(
    taskId: number,
    templateId: number,
    taskResultItems: ItemResultParams[],
    permitId?: number,
  ) {
    this.taskId = taskId
    this.templateId = templateId
    this.taskResultItems = taskResultItems
    this.permitId = permitId
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}
    data['task_id'] = this.taskId
    data['template_id'] = this.templateId
    data['task_result_items'] = this.taskResultItems
    if (this.permitId) data['permit_id'] = this.permitId

    return data
  }
}
