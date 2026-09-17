import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'

export default class MeetingActionsModel {
  public id: number
  public meetingId: number
  public title: string
  public type: number
  public status: number
  public createdAt: string
  public dueDate: string
  public dueTime: string
  public assignedEmployee: OrganizatoinEmployeeModel

  constructor(data: {
    id: number
    meetingId: number
    title: string
    type: number
    status: number
    createdAt: string
    dueDate: string
    dueTime: string
    assignedEmployee: OrganizatoinEmployeeModel
  }) {
    this.id = data.id
    this.meetingId = data.meetingId
    this.title = data.title
    this.type = data.type
    this.status = data.status
    this.createdAt = data.createdAt
    this.dueDate = data.dueDate
    this.dueTime = data.dueTime
    this.assignedEmployee = data.assignedEmployee
  }

  static fromMap(data: any): MeetingActionsModel {
    return new MeetingActionsModel({
      id: data.id,
      meetingId: data.meeting_id,
      title: data.title,
      type: data.type,
      status: data.status,
      createdAt: data.created_at,
      assignedEmployee: data.assigned_employee,
      dueDate: data.due_date,
      dueTime: data.due_time,
    })
  }

  static example: MeetingActionsModel = new MeetingActionsModel({
    id: 1,
    meetingId:2,
    title: '',
    type: 2,
    status: 2,
    createdAt:'',
    assignedEmployee: OrganizatoinEmployeeModel.exampl2,
    dueDate: '',
    dueTime: '',
  })
}
