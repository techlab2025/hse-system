import type FilesModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FilesModel'
import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'

export default class InjuryDetailsModel {
  public id: number
  public title: string
  public description: string
  public created_at: string
  public employee_name: string
  public is_work_stopped: boolean
  public media: FilesModel[]
  public note: string
  public organization_employee: OrganizatoinEmployeeModel
  public status: number
  public type: number
  public updated_at: string

  constructor(
    id: number,
    title: string,
    description: string,
    created_at: string,
    employee_name: string,
    is_work_stopped: boolean,
    media: FilesModel[],
    note: string,
    organization_employee: OrganizatoinEmployeeModel,
    status: number,
    type: number,
    updated_at: string,
  ) {
    this.id = id
    this.title = title
    this.description = description
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

  static fromMap(data: any): InjuryDetailsModel {
    return new InjuryDetailsModel(
      data.id,
      data.title,
      data.description,
      data.created_at,
      data.employee_name,
      data.is_work_stopped,
      data.media,
      data.note,
      OrganizatoinEmployeeModel.fromMap(data.organization_employee),
      data.status,
      data.type,
      data.updated_at,
    )
  }
}
