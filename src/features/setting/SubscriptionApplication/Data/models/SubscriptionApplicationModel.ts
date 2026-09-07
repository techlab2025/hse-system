import TitleInterface from '@/base/Data/Models/title_interface'

interface IndustryReference {
  id: number
  title?: string | null
  titile?: string | null
}

interface SubscriptionApplicationMap {
  id: number
  subscription_application_id: number
  request_date: string
  request_status: number
  status_name: string
  name: string
  phone: string
  email: string
  address: string | null
  admin_name: string
  admin_phone: string
  admin_email: string
  industry_id: IndustryReference
}

export default class SubscriptionApplicationModel extends TitleInterface {
  public id: number
  public subscription_application_id: number
  public request_date: string
  public request_status: number
  public status_name: string
  public name: string
  public phone: string
  public email: string
  public address: string | null
  public admin_name: string
  public admin_phone: string
  public admin_email: string
  public industry_id: IndustryReference

  constructor(
    id: number,
    subscription_application_id: number,
    request_date: string,
    request_status: number,
    status_name: string,
    name: string,
    phone: string,
    email: string,
    address: string | null,
    admin_name: string,
    admin_phone: string,
    admin_email: string,
    industry_id: IndustryReference,
  ) {
    super({ id: id, title: name })

    this.id = id
    this.subscription_application_id = subscription_application_id
    this.request_date = request_date
    this.request_status = request_status
    this.status_name = status_name
    this.name = name
    this.phone = phone
    this.email = email
    this.address = address
    this.admin_name = admin_name
    this.admin_phone = admin_phone
    this.admin_email = admin_email
    this.industry_id = industry_id
  }

  static fromMap(data: SubscriptionApplicationMap): SubscriptionApplicationModel {
    return new SubscriptionApplicationModel(
      data.id,
      data.subscription_application_id,
      data.request_date,
      data.request_status,
      data.status_name,
      data.name,
      data.phone,
      data.email,
      data.address,
      data.admin_name,
      data.admin_phone,
      data.admin_email,
      data.industry_id,
    )
  }
}
