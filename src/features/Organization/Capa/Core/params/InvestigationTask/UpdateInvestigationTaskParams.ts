import type Params from '@/base/core/params/params'

export default class UpdateInvestigationTaskParams implements Params {
  private id: number
  private status: number
  private reason?: string
  constructor(data: { id: number; status: number; reason?: string }) {
    this.id = data.id
    this.status = data.status
    this.reason = data.reason
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    data['investigation_task_id'] = this.id
    data['status'] = this.status
    if (this.reason) data['reason'] = this.reason
    return data
  }
}
