import FilesModel from './filesModel'
import TaskResultItemAnswerModel from './TaskResultItemAnswerModel'

export default class TaskResultItemModel {
  public id: number
  public result: string
  public answers: TaskResultItemAnswerModel[]
  public templateItemAction: number
  public files: FilesModel

  constructor(
    id: number,
    result: string,
    answers: TaskResultItemAnswerModel[],
    templateItemAction: number,
    files: FilesModel,
  ) {
    this.id = id
    this.result = result
    this.answers = answers
    this.templateItemAction = templateItemAction
    this.files = files
  }

  static fromMap(data: any): TaskResultItemModel {
    return new TaskResultItemModel(
      data.id,
      data.result,
      data.task_result_item_answers?.map((a: any) => TaskResultItemAnswerModel.fromMap(a)) ?? [],
      data.template_item_action,
      data.media,
    )
  }
}
