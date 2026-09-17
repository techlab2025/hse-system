import TitleInterface from '@/base/Data/Models/title_interface'

export default class ProjectPermitsModel extends TitleInterface {
  public id: number
  public title: string

  constructor(id: number, title: string) {
    super({ id, title })
    this.id = id
    this.title = title
  }

  static fromMap(data: any): ProjectPermitsModel {
    return new ProjectPermitsModel(data.id, data.title)
  }

  static example: ProjectPermitsModel = new ProjectPermitsModel(
    1,
    'Eco-friendly / Sustainability-oriented Names',
  )
}
