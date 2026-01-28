import type Params from '@/base/core/params/params'

export default class ApproveSubscriptionApplicationParams implements Params {
  SubscriptionApplicationId: number

  constructor(data: { SubscriptionApplicationId: number }) {
    this.SubscriptionApplicationId = data.SubscriptionApplicationId
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['subscription_application_id'] = this.SubscriptionApplicationId
    return data
  }
}
