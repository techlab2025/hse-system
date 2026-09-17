import type Params from '@/base/core/params/params'

export default class ShowTaskHistoryParams implements Params {
  task_id: number

  constructor(task_id: number) {
    this.task_id = task_id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['task_id'] = this.task_id
    return data
  }
}
