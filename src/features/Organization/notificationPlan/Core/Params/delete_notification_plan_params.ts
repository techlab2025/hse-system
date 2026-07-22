import type Params from '@/base/core/params/params'

export default class DeleteNotificationPlanParams implements Params {
  constructor(public notificationPlanId: number) {}

  toMap(): Record<string, number> {
    return {
      notification_plan_id: this.notificationPlanId,
    }
  }
}
