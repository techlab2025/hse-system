import type Params from '@/base/core/params/params'

export default class CreateProjectLocationTeamEmployeeParams implements Params {
  public id: number
  public teams: ProjectTeams[]
  constructor(id: number, teams: ProjectTeams[]) {
    this.id = id
    this.teams = teams
  }

  toMap(): Record<string, number | any[]> {
    const data: Record<string, number | any[]> = {}
    data['project_id'] = this.id
    data['teams'] = this.teams
    return data
  }
}

interface ProjectTeams {
  project_location_id: number
  team_id: number
  employee_ids: number
}
