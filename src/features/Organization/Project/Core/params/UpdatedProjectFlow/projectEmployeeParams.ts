import type Params from '@/base/core/params/params'

export default class ProjectEmployeeParams implements Params {
  public readonly organizaion_employee_id: number
  public readonly is_leader: boolean

  constructor(data: { organizaion_employee_id: number; is_leader?: boolean }) {
    this.organizaion_employee_id = data.organizaion_employee_id
    this.is_leader = data.is_leader ?? false
  }

  toMap(): Record<string, unknown> {
    return {
      organization_employee_id: this.organizaion_employee_id,
      is_leader: this.is_leader,
    }
  }
}
