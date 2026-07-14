import type Params from '@/base/core/params/params'

export default class EditNotificationPlanParams implements Params {
  constructor(
    public notificationPlanId: number,
    public title?: string,
    public actionValues?: number[],
    public employeeIds: number[] = [],
    public hierarchyIds: number[] = [],
    public isActive?: boolean,
  ) {}

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {
      notification_plan_id: this.notificationPlanId,
    }

    if (this.title !== undefined) data.title = this.title
    if (this.isActive !== undefined) data.is_active = this.isActive
    if (this.actionValues !== undefined) data.action_values = this.actionValues
    if (this.employeeIds.length > 0) data.employee_ids = this.employeeIds
    if (this.hierarchyIds.length > 0) data.hierarchy_ids = this.hierarchyIds

    return data
  }
}
