import type Params from '@/base/core/params/params.ts'

export default class FetchTaskResultParams implements Params {
  public taskResultId: number

  constructor(taskResultId: number) {
    this.taskResultId = taskResultId
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}
    data['task_id'] = this.taskResultId

    return data
  }
}
