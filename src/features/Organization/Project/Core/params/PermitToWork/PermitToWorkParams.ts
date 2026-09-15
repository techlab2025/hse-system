import type Params from '@/base/core/params/params'

export default class PermitToWorkParams implements Params {
  public project_id: number
  public ptw_number: string
  public ptw_type_id: number
  public start_date: string | null
  public end_date: string | null
  public start_time: string | null
  public end_time: string | null
  public location: string
  public description: string

  constructor(data: {
    project_id: number
    ptw_number: string
    ptw_type_id: number
    start_date: string | null
    end_date: string | null
    start_time: string | null
    end_time: string | null
    location: string
    description: string
  }) {
    this.project_id = data.project_id
    this.ptw_number = data.ptw_number
    this.ptw_type_id = data.ptw_type_id
    this.start_date = data.start_date
    this.end_date = data.end_date
    this.start_time = data.start_time
    this.end_time = data.end_time
    this.location = data.location
    this.description = data.description
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
      |any
    > = {}

    data['project_id'] = this.project_id
    data['ptw_number'] = this.ptw_number
    data['permit_type_id'] = this.ptw_type_id
    data['start_date'] = this.start_date
    data['end_date'] = this.end_date
    data['start_time'] = this.start_time
    data['end_time'] = this.end_time
    data['location'] = this.location
    data['description'] = this.description

    return data
  }
}
