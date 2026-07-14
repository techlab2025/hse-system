import type Params from '@/base/core/params/params'

export default class ShowNotificationPlanParams implements Params {
  constructor(public notificationPlanId: number) {}

  toMap(): { [p: string]: any } {
    return {
      notification_plan_id: this.notificationPlanId,
    }
  }
}
