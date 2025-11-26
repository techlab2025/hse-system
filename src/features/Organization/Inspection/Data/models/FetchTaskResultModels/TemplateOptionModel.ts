export default class TemplateOptionModel {
  public id: number
  public title: string
  public is_danger: number

  constructor(id: number, title: string, is_danger: number) {
    this.id = id
    this.title = title
    this.is_danger = is_danger
  }

  static fromMap(data: any): TemplateOptionModel {
    return new TemplateOptionModel(data.id, data.title, data.is_danger)
  }
}
