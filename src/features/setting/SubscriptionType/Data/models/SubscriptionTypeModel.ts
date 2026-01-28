import TitleInterface from '@/base/Data/Models/title_interface'

export default class SubscriptionTypeModel extends TitleInterface {
  public id: number
  public title: string
  public days: number
  public isActive: boolean
  public isDefault: boolean
  public isFree: boolean
  public isSupportExists: boolean
  public price: number
  public supportDays: number
  public supportPrice: number
  public type: number
  public typeLabel: string

  constructor(
    id: number,
    title: string,
    days: number,
    isActive: boolean,
    isDefault: boolean,
    isFree: boolean,
    isSupportExists: boolean,
    price: number,
    supportDays: number,
    supportPrice: number,
    type: number,
    typeLabel: string,
  ) {
    super({ id, title })

    this.id = id
    this.title = title
    this.days = days
    this.isActive = isActive
    this.isDefault = isDefault
    this.isFree = isFree
    this.isSupportExists = isSupportExists
    this.price = price
    this.supportDays = supportDays
    this.supportPrice = supportPrice
    this.type = type
    this.typeLabel = typeLabel
  }

  static fromMap(data: any): SubscriptionTypeModel {
    return new SubscriptionTypeModel(
      data.id,
      data.title,
      data.days,
      data.is_active,
      data.is_default,
      data.is_free,
      data.is_support_exists,
      data.price,
      data.support_days,
      data.support_price,
      data.type,
      data.type_label,
    )
  }
}
