import type Params from '@/base/core/params/params'

export default class CreateProjectZoneParams implements Params {
  projectId: number
  projectLocationId: number
  zoonId: number

  constructor(projectId: number, projectLocationId: number, zoonId: number) {
    this.projectId = projectId
    this.projectLocationId = projectLocationId
    this.zoonId = zoonId
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

    data['project_id'] = this.projectId
    data['location_id'] = this.projectLocationId
    data['zoon_id'] = this.zoonId

    return data
  }
}
