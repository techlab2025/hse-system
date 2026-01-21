import type OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

export default class LastInspectionModel {
  public id: number
  public date: string
  public taskResultId: number
  public name: string
  public status: number
  public employee: OrganizatoinEmployeeDetailsModel
  public created_by: CreatedBy
  constructor(
    id: number,
    date: string,
    taskResultId: number,
    name: string,
    status: number,
    employee: OrganizatoinEmployeeDetailsModel,
    created_by: CreatedBy,
  ) {
    this.id = id
    this.date = date
    this.taskResultId = taskResultId
    this.name = name
    this.status = status
    this.employee = employee
    this.created_by = created_by
  }

  static fromMap(data: any): LastInspectionModel {
    return new LastInspectionModel(
      data.id,
      data.date,
      data.task_result_id,
      data.name,
      data.status,
      data.employee,
      data.created_by,
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
