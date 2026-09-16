import type Params from '@/base/core/params/params.ts'
import type ItemResultParams from '@/features/Organization/Inspection/Core/params/ItemResultParams'

export default class CreatePermitToWorkResultParams implements Params {
  public templateId: number
  public taskResultItems: ItemResultParams[]
  public permitId?: number

  constructor(templateId: number, taskResultItems: ItemResultParams[], permitId?: number) {
    this.templateId = templateId
    this.taskResultItems = taskResultItems
    this.permitId = permitId
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}
    data['template_id'] = this.templateId
    data['permit_to_work_result_items'] = this.taskResultItems
    if (this.permitId) data['permit_to_work_id'] = this.permitId

    return data
  }
}
