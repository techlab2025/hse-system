import TitleInterface from '@/base/Data/Models/title_interface'

export default class PermitToWorkModel extends TitleInterface {
  public id: number
  public title: string

  constructor(id: number, title: string) {
    super({ id, title })
    this.id = id
    this.title = title
  }

  static fromMap(data: any): PermitToWorkModel {
    return new PermitToWorkModel(data.id, data.title)
  }

  static example: PermitToWorkModel = new PermitToWorkModel(
    1,
    'Eco-friendly / Sustainability-oriented Names',
  )
}
