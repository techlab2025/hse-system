import type Params from '@/base/core/params/params'

export default class UpdateInvestigationTaskParams implements Params {
  private id: number
  private status: number
  constructor(data: { id: number; status: number }) {
    this.id = data.id
    this.status = data.status
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['investigation_task_id'] = this.id
    data['status'] = this.status
    return data
  }
}
