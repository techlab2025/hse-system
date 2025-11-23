import type Params from '@/base/core/params/params.ts'

export default class CreateTaskResultParams implements Params {
  public taskId: number
  public templateId: number
  public taskResultItems: TaskResult

  constructor(taskId: number, templateId: number, taskResultItems: TaskResult) {
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
    data['task_result_items'] = this.taskResultItems

    return data
  }
}

interface TaskResult {
  result: string
  template_item_id: string
}
