import type Params from '@/base/core/params/params'

export default class CreateInvestigationTaskResultParams implements Params {
  constructor(
    public investigation_task_id: number,
    public notes: string,
  ) {
    this.investigation_task_id = investigation_task_id
    this.notes = notes
  }

  toMap(): Record<string, string | number> {
    const data: Record<string, string | number> = {}
    data['investigation_task_id'] = this.investigation_task_id
    data['notes'] = this.notes
    return data
  }
}
