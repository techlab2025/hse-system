export default class TemplateItemTagModel {
  constructor(
    id: number,
    title: string,
    isDanger: number,
    textareaType: string,
    hasObservation: number,
  ) {
    // this.isDanger = isDanger
  }

  static fromMap(data: any): TemplateItemTagModel {
    return new TemplateItemTagModel(
      data.id,
      data.title,
      data.is_danger,
      data.textarea_type,
      data.has_observation,
    )
  }
}
