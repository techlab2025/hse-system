import type Params from '@/base/core/params/params'

export default class DeleteProjectlocationTeamEmployeeParams implements Params {
  constructor(public id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['project_location_team_employee_id'] = this.id
    return data
  }
}
