import type Params from '@/base/core/params/params'

export type ProjectLocationTeam = {
  project_location_id: number
  project_teams: {
    team_id: number
    organizaion_employees: { organizaion_employee_id: number }[]
  }[]
}

export default class ProjectTeamsParams implements Params {
  constructor(
    public readonly locations: ProjectLocationTeam[],
    public readonly projectId: number,
    public readonly isUpdate: boolean = false,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      locations: this.locations,
    }
  }
}
