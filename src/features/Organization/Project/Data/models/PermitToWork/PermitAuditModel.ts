import TitleInterface from '@/base/Data/Models/title_interface'

export default class FetchPermitAuditModel extends TitleInterface {
  public id: number
  public title: string

  constructor(id: number, title: string) {
    super({ id, title })
    this.id = id
    this.title = title
  }

  static fromMap(data: any): FetchPermitAuditModel {
    return new FetchPermitAuditModel(data.id, data.title)
  }

  static example: FetchPermitAuditModel = new FetchPermitAuditModel(
    1,
    'Eco-friendly / Sustainability-oriented Names',
  )
}
