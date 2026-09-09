import type Params from '@/base/core/params/params'

export default class ProjectEmployeeParams implements Params {
  public readonly organizaion_employee_id: number

  constructor(data: { organizaion_employee_id: number }) {
    this.organizaion_employee_id = data.organizaion_employee_id
  }

  toMap(): Record<string, unknown> {
    return {
      organization_employee_id: this.organizaion_employee_id,
    }
  }
}
