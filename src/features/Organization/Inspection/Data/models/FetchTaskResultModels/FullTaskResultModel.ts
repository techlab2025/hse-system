import TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import TaskResultModel from './TasksResultModel'

export default class TaskFullResponseModel {
  public id: number
  public date: string
  public status: number
  public periodType: number
  public periodSubType: number
  public taskNumber: string
  public template: TemplateDetailsModel
  public taskResults: TaskResultModel[]

  constructor(
    id: number,
    date: string,
    status: number,
    periodType: number,
    periodSubType: number,
    taskNumber: string,
    template: TemplateDetailsModel,
    taskResults: TaskResultModel[],
  ) {
    this.id = id
    this.date = date
    this.status = status
    this.periodType = periodType
    this.periodSubType = periodSubType
    this.taskNumber = taskNumber
    this.template = template
    this.taskResults = taskResults
  }

  static fromMap(data: any): TaskFullResponseModel {
    return new TaskFullResponseModel(
      data.id,
      // data.zone,
      data.date,
      data.status,
      data.period_type,
      data.period_sub_type,
      data.task_number,
      // data.morph,
      // data.template,
      TemplateDetailsModel.fromMap(data.template),
      data.task_results.map((r: any) => TaskResultModel.fromMap(r)) ?? [],
    )
  }
}
