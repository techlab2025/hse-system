import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class SubscriptionTypeDetailsModel {
  public id: number
  public titles: TitleLocale[]
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
    titles: TitleLocale[],
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
    this.id = id
    this.titles = titles
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

  static fromMap(data: any): SubscriptionTypeDetailsModel {
    return new SubscriptionTypeDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
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

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
