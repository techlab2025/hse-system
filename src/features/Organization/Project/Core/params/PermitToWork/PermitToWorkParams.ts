import type Params from '@/base/core/params/params'

export default class PermitToWorkParams implements Params {
  public project_id: number
  public organization_employee_id: number
  public ptw_number: string
  public ptw_type_id: number
  public start_date: string | null
  public end_date: string | null
  public start_time: string | null
  public end_time: string | null
  public location: string
  public description: string
  public attachments:string[]

  constructor(data: {
    project_id: number
    organization_employee_id: number
    ptw_number: string
    ptw_type_id: number
    start_date: string | null
    end_date: string | null
    start_time: string | null
    end_time: string | null
    location: string
    description: string
    attachments:string[]
  }) {
    this.project_id = data.project_id
    this.organization_employee_id = data.organization_employee_id
    this.ptw_number = data.ptw_number
    this.ptw_type_id = data.ptw_type_id
    this.start_date = data.start_date
    this.end_date = data.end_date
    this.start_time = data.start_time
    this.end_time = data.end_time
    this.location = data.location
    this.description = data.description
    this.attachments = data.attachments

  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    data['project_id'] = this.project_id
    data['asigned_employee_id'] = this.organization_employee_id
    data['ptw_number'] = this.ptw_number
    data['permit_type_id'] = this.ptw_type_id
    data['start_date'] = this.start_date
    data['end_date'] = this.end_date
    data['start_time'] = this.start_time
    data['end_time'] = this.end_time
    data['location'] = this.location
    data['description'] = this.description
    data['attachments'] = this.attachments

    return data
  }
}
