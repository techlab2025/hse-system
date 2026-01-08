export default class TemplateOptionModel {
  public id: number
  public title: string
  public is_danger: number
  public has_auto_observation: number
  public textarea_type: number

  constructor(
    id: number,
    title: string,
    is_danger: number,
    has_auto_observation: number,
    textarea_type: number,
  ) {
    this.id = id
    this.title = title
    this.is_danger = is_danger
    this.has_auto_observation = has_auto_observation
    this.textarea_type = textarea_type
  }

  static fromMap(data: any): TemplateOptionModel {
    return new TemplateOptionModel(
      data.id,
      data.title,
      data.is_danger,
      data.has_auto_observation,
      data.textarea_type,
    )
  }
}
