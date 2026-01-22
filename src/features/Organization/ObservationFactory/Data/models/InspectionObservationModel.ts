import type TitleInterface from '@/base/Data/Models/title_interface'
import type FilesModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FilesModel'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'

export default class InspectionObservatioModel {
  public taskId: number
  public serialNumber: string
  public serial: string
  public createdBy: CreatedBy
  public periodType: number
  public periodSubType: number
  public morphType: number
  public morphId: number
  public templateTitle: string
  public templateItemTitle: string
  public taskResultItemId: number
  public media: FilesModel[]
  public taskResultItemAnswerTextReply: string
  public answers: ItemModel[]
  constructor(
    taskId: number,
    serialNumber: string,
    serial: string,
    createdBy: CreatedBy,
    periodType: number,
    periodSubType: number,
    morphType: number,
    morphId: number,
    templateTitle: string,
    templateItemTitle: string,
    taskResultItemId: number,
    media: FilesModel[],
    taskResultItemAnswerTextReply: string,
    answers: ItemModel[],
  ) {
    this.taskId = taskId
    this.serialNumber = serialNumber
    this.serial = serial
    this.createdBy = createdBy
    this.periodType = periodType
    this.periodSubType = periodSubType
    this.morphType = morphType
    this.morphId = morphId
    this.templateTitle = templateTitle
    this.templateItemTitle = templateItemTitle
    this.taskResultItemId = taskResultItemId
    this.media = media
    this.taskResultItemAnswerTextReply = taskResultItemAnswerTextReply
    this.answers = answers
  }

  static fromMap(data: any): InspectionObservatioModel {
    return new InspectionObservatioModel(
      data.task_id,
      data.serial_number,
      data.serial,
      data.created_by,
      data.period_type,
      data.period_sub_type,
      data.morph_type,
      data.morph_id,
      data.template_title,
      data.template_item_title,
      data.task_result_item_id,
      data.media,
      data.task_result_item_answer_text_reply,
      data.answers,
    )
  }
}
interface CreatedBy {
  id: number
  organization_employee_id: number
  name: string
  hierarchy: any[]
  date: string
  time: string
}
