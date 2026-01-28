import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

export default class AddSubscriptionParams implements Params {
  organizationId: number
  subscriptionTypeId: number
  fromDate: string
  requestedPrice: number
  hasDiscount: boolean
  discountPrice: number
  notes: string

  constructor(data: {
    organizationId: number
    subscriptionTypeId: number
    fromDate: string
    requestedPrice: number
    hasDiscount: boolean
    discountPrice: number
    notes: string
  }) {
    this.organizationId = data.organizationId
    this.subscriptionTypeId = data.subscriptionTypeId
    this.fromDate = data.fromDate
    this.requestedPrice = data.requestedPrice
    this.hasDiscount = data.hasDiscount
    this.discountPrice = data.discountPrice
    this.notes = data.notes
  }

  toMap(): Record<
    string,
    | number
    | string
    | boolean
    | number[]
    | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | boolean
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['organization_id'] = this.organizationId
    data['subscription_type_id'] = this.subscriptionTypeId
    data['from_date'] = formatJoinDate(this.fromDate)
    data['requested_price'] = this.requestedPrice
    data['has_discount'] = this.hasDiscount
    data['discount_price'] = this.discountPrice
    data['notes'] = this.notes

    return data
  }
}
