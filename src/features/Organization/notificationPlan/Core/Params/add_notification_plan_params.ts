import type Params from '@/base/core/params/params'

export interface NotificationPlanActionValueParam {
  action: number
  sub_action: number | null
}

export default class AddNotificationPlanParams implements Params {
  constructor(
    public title: string,
    public actionValues: NotificationPlanActionValueParam[],
    public employeeIds: number[] = [],
    public hierarchyIds: number[] = [],
    public isActive?: boolean,
    public heirarchy: 0 | 1 = 0,
  ) {}

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {
      title: this.title,
      action_values: this.actionValues,
      heirarchy: this.heirarchy,
    }

    if (this.isActive !== undefined) data.is_active = this.isActive
    if (this.employeeIds.length > 0) data.employee_ids = this.employeeIds
    if (this.hierarchyIds.length > 0) data.hierarchy_ids = this.hierarchyIds

    return data
  }
}
