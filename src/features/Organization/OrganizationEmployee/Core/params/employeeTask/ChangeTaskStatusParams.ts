import type Params from '@/base/core/params/params'

export default class ChangeTaskStatusParams implements Params {
  private id: number
  private status: number
  private reason: string

  constructor(data: { id: number; status: number; reason: string }) {
    this.id = data.id
    this.status = data.status
    this.reason = data.reason
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    data['task_id'] = this.id
    data['status'] = this.status
    data['reason'] = this.reason
    return data
  }
}