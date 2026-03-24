import type OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

export default class LastInspectionModel {
  public id: number
  public date: string
  public taskResultId: number
  public name: string
  public status: number
  public employee: OrganizatoinEmployeeDetailsModel | null
  public created_by: CreatedBy | null
  public time: string
  public taskId: number

  constructor(
    id: number,
    date: string,
    taskResultId: number,
    name: string,
    status: number,
    employee: OrganizatoinEmployeeDetailsModel | null,
    created_by: CreatedBy | null,
    time: string,
    taskId: number,
  ) {
    this.id = id
    this.date = date
    this.taskResultId = taskResultId
    this.name = name
    this.status = status
    this.employee = employee
    this.created_by = created_by
    this.time = time
    this.taskId = taskId
  }

  static fromMap(data: any): LastInspectionModel {
    return new LastInspectionModel(
      data.id,
      data.date,
      data.task_result_id,
      data.name,
      data.status,
      data?.employee,
      data?.created_by,
      data.time,
      data.task_id,
    )
  }

  static example: LastInspectionModel = new LastInspectionModel(
    1,
    '2026-03-15',
    5,
    'Monthly Inspection',
    1,
    null,
    {
      id: 1,
      organization_employee_id: 12,
      name: 'Ahmed Hassan',
      hierarchy: [],
      date: '2026-03-15',
      time: '10:30',
    },
    '10:30',
    1,
  )
}
interface CreatedBy {
  id: number
  organization_employee_id: number
  name: string
  hierarchy: any[]
  date: string
  time: string
}
