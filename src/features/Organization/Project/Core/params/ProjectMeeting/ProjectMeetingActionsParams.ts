import type Params from '@/base/core/params/params'
import type { ProjectMeetingActionsTypeEnum } from './enums/ProjectMeetingActionEnum'

export default class CreateProjectMeetingActionsParams implements Params {
  public type: ProjectMeetingActionsTypeEnum
  public title: string
  public dueDate: string
  public dueTime: string
  public assignedOrganizationEmployeeId: number

  constructor(data: {
    type: ProjectMeetingActionsTypeEnum
    title: string
    dueDate: string
    dueTime: string
    assignedOrganizationEmployeeId: number
  }) {
    this.type = data.type
    this.title = data.title
    this.dueDate = data.dueDate
    this.dueTime = data.dueTime
    this.assignedOrganizationEmployeeId = data.assignedOrganizationEmployeeId
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['type'] = this.type
    data['title'] = this.title
    data['due_date'] = this.dueDate
    data['due_time'] = this.dueTime
    data['assigned_employee_id'] = this.assignedOrganizationEmployeeId

    return data
  }
}
