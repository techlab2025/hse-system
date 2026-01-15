import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

export default class witnessStatementsModel {
  public id: number
  public created_at: string
  public employee_name: string
  public is_work_stopped: boolean
  public media: []
  public note: string
  public organization_employee: OrganizatoinEmployeeDetailsModel
  public status: number
  public type: number
  public updated_at: string

  constructor(
    id: number,
    created_at: string,
    employee_name: string,
    is_work_stopped: boolean,
    media: [],
    note: string,
    organization_employee: OrganizatoinEmployeeDetailsModel,
    status: number,
    type: number,
    updated_at: string,
  ) {
    this.id = id
    this.created_at = created_at
    this.employee_name = employee_name
    this.is_work_stopped = is_work_stopped
    this.media = media
    this.note = note
    this.organization_employee = organization_employee
    this.status = status
    this.type = type
    this.updated_at = updated_at
  }

  static fromMap(data: any): witnessStatementsModel {
    return new witnessStatementsModel(
      data.id,
      data.created_at,
      data.employee_name,
      data.is_work_stopped,
      data.media,
      data.note,
      OrganizatoinEmployeeDetailsModel.fromMap(data.organization_employee),
      data.status,
      data.type,
      data.updated_at,
    )
  }
}
