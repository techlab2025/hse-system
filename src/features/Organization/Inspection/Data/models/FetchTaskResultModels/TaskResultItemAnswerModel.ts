import TemplateOptionModel from './TemplateOptionModel'

export default class TaskResultItemAnswerModel {
  public id: number
  public answer: string
  public templateItemOption: TemplateOptionModel | null

  constructor(id: number, answer: string, templateItemOption: TemplateOptionModel | null) {
    this.id = id
    this.answer = answer
    this.templateItemOption = templateItemOption
  }

  static fromMap(data: any): TaskResultItemAnswerModel {
    return new TaskResultItemAnswerModel(
      data.id,
      data.answer,
      data.template_item_option ? TemplateOptionModel.fromMap(data.template_item_option) : null,
    )
  }
}
