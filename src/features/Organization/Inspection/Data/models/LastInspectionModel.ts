import type OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

export default class LastInspectionModel {
  public id: number
  public date: string
  public taskResultId: number
  public name: string
  public status: number
  public employee: OrganizatoinEmployeeDetailsModel
  constructor(
    id: number,
    date: string,
    taskResultId: number,
    name: string,
    status: number,
    employee: OrganizatoinEmployeeDetailsModel,
  ) {
    this.id = id
    this.date = date
    this.taskResultId = taskResultId
    this.name = name
    this.status = status
    this.employee = employee
  }

  static fromMap(data: any): LastInspectionModel {
    return new LastInspectionModel(
      data.id,
      data.date,
      data.task_result_id,
      data.name,
      data.status,
      data.employee,
    )
  }
}
