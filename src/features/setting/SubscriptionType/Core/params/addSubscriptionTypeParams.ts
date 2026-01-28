import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type { SubscriptionTypeEnum } from '../Enum/SubscriptionTypeEnum'

export default class AddSubscriptionTypeParams implements Params {
  translation: TranslationsParams
  price: number
  days: number
  isSupportExists: boolean
  support_days: number
  support_price: number
  is_active: boolean
  is_default: boolean
  is_free: boolean
  type: SubscriptionTypeEnum

  constructor(data: {
    translation: TranslationsParams
    price: number
    days: number
    isSupportExists: boolean
    support_days: number
    support_price: number
    is_active: boolean
    is_default: boolean
    is_free: boolean
    type: SubscriptionTypeEnum
  }) {
    this.translation = data.translation
    this.price = data.price
    this.days = data.days
    this.isSupportExists = data.isSupportExists
    this.support_days = data.support_days
    this.support_price = data.support_price
    this.is_active = data.is_active
    this.is_default = data.is_default
    this.is_free = data.is_free
    this.type = data.type
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

    data['translations'] = this.translation.toMap()
    data['price'] = this.price
    data['days'] = this.days
    data['is_support_exists'] = this.isSupportExists
    data['support_days'] = this.support_days
    data['support_price'] = this.support_price
    data['is_active'] = this.is_active
    data['is_default'] = this.is_default
    data['is_free'] = this.is_free
    data['type'] = this.type

    return data
  }
}
