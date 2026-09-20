import { ChangeTaskStatusEnum } from '../../Core/Enum/ChangeTaskStatusEnum'
import ResponsblePresonTaskModel from './ResponsblePresonTaskModel'

export default class IndexOwnTaskModel {
  public id: number
  public title: string
  public status: ChangeTaskStatusEnum
  public created_at?:string
  public actual_task_id?:number
  public investigation_task_id?:number
  public reason?:string
  public due_date?:string
  public due_time?:string
  public assigned_to?:string
  public responable_person?: ResponsblePresonTaskModel

  constructor(data: {
    id: number
    title: string
    status: ChangeTaskStatusEnum
    created_at?:string
    actual_task_id?:number
    investigation_task_id?:number
    reason?:string
    due_date?:string
    due_time?:string
    assigned_to?:string
    responable_person?: ResponsblePresonTaskModel
  }) {
    this.id = data.id
    this.title = data.title
    this.status = data.status
    this.created_at = data.created_at
    this.actual_task_id = data.actual_task_id
    this.investigation_task_id = data.investigation_task_id
    this.reason = data.reason
    this.due_date = data.due_date
    this.due_time = data.due_time
    this.assigned_to = data.assigned_to
    this.responable_person = data.responable_person
  }

  static fromMap(data: any): IndexOwnTaskModel {
    return new IndexOwnTaskModel({
      id: data?.id,
      title: data?.title ?? '',
      status: data?.status?data.status: 1,
      created_at: data?.created_at,
      actual_task_id: data?.actual_task_id,
      investigation_task_id: data?.investigation_task_id,
      reason: data?.reason,
      due_date: data?.due_date,
      due_time: data?.due_time,
      assigned_to: data?.assigned_to,
      responable_person: data?.responable_person ? ResponsblePresonTaskModel.fromMap(data.responable_person) : undefined
    })
  }

  static example: IndexOwnTaskModel = new IndexOwnTaskModel({
    id: 1,
    title: 'Site inspection',
    status: ChangeTaskStatusEnum.COMPLETED,
    created_at: '2026-10-01T10:00:00Z',
    actual_task_id: 101,
    investigation_task_id: 201,
    reason: 'Routine check',
    due_date: '2026-10-05',
    due_time: '15:00',
    assigned_to: 'Ahmed',
    responable_person: ResponsblePresonTaskModel.example
  })
}
