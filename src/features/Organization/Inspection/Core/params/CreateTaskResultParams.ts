import type Params from '@/base/core/params/params.ts'
import type ItemResultParams from './ItemResultParams'

export default class CreateTaskResultParams implements Params {
  public taskId: number
  public templateId: number
  public taskResultItems: ItemResultParams[]

  constructor(taskId: number, templateId: number, taskResultItems: ItemResultParams[]) {
    this.taskId = taskId
    this.templateId = templateId
    this.taskResultItems = taskResultItems
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}
    data['task_id'] = this.taskId
    data['template_id'] = this.templateId
    data['task_result_item'] = this.taskResultItems

    return data
  }
}
