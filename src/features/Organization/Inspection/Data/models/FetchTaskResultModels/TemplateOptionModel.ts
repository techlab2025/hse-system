export default class TemplateOptionModel {
  public id: number
  public title: string
  public is_danger: number
  public has_auto_observation: number
  public textarea_type: number
  public is_upload: boolean

  constructor(
    id: number,
    title: string,
    is_danger: number,
    has_auto_observation: number,
    textarea_type: number,
    is_upload: boolean | number,
  ) {
    this.id = id
    this.title = title
    this.is_danger = is_danger
    this.has_auto_observation = has_auto_observation
    this.textarea_type = textarea_type
    this.is_upload = is_upload === true || Number(is_upload) === 1
  }

  static fromMap(data: any): TemplateOptionModel {
    return new TemplateOptionModel(
      data.id,
      data.title,
      data.is_danger,
      data.has_auto_observation,
      data.textarea_type,
      data.is_upload ?? data.isUpload ?? false,
    )
  }
}
