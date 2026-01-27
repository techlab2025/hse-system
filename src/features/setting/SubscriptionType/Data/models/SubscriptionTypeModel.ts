import TitleInterface from '@/base/Data/Models/title_interface'

export default class SubscriptionTypeModel extends TitleInterface {
  public id: number
  public title: string

  constructor(
    id: number,
    title: string,

  ) {
    super({ id, title, })

    this.id = id
    this.title = title
  }

  static fromMap(data: any): SubscriptionTypeModel {
    return new SubscriptionTypeModel(
      data.id,
      data.title,

    )
  }
}
