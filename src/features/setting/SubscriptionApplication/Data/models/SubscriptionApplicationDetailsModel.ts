import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type OrganizationDetailsModel from '@/features/setting/Organization/Data/models/OrganizationDetailsModel'
import type SubscriptionTypeDetailsModel from '@/features/setting/SubscriptionType/Data/models/SubscriptionTypeDetailsModel'

export default class SubscriptionDetailsModel {
  public id: number
  public notes: string
  public discount_price: number
  public final_price: number
  public from_date: string
  public has_discount: boolean
  public organization: OrganizationDetailsModel
  public payment_method_id: number
  public requested_price: number
  public status: string
  public subscription_type: SubscriptionTypeDetailsModel
  public to_date: string
  constructor(
    id: number,
    notes: string,
    discount_price: number,
    final_price: number,
    from_date: string,
    has_discount: boolean,
    organization: OrganizationDetailsModel,
    payment_method_id: number,
    requested_price: number,
    status: string,
    subscription_type: SubscriptionTypeDetailsModel,
    to_date: string,
  ) {
    this.id = id
    this.notes = notes
    this.discount_price = discount_price
    this.final_price = final_price
    this.from_date = from_date
    this.has_discount = has_discount
    this.organization = organization
    this.payment_method_id = payment_method_id
    this.requested_price = requested_price
    this.status = status
    this.subscription_type = subscription_type
    this.to_date = to_date
  }

  static fromMap(data: any): SubscriptionDetailsModel {
    return new SubscriptionDetailsModel(
      data.id,
      data.notes,
      data.discount_price,
      data.final_price,
      data.from_date,
      data.has_discount,
      data.organization,
      data.payment_method_id,
      data.requested_price,
      data.status,
      data.subscription_type,
      data.to_date,
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
