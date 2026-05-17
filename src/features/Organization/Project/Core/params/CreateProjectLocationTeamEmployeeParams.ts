import type Params from '@/base/core/params/params'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class CreateProjectLocationTeamEmployeeParams implements Params {
  public id: number
  public teams: ProjectTeams[]
  constructor(id: number, teams: ProjectTeams[]) {
    this.id = id
    this.teams = teams
  }

  toMap(): Record<string, number | null | any[]> {
    const data: Record<string, number | null | any[]> = {}
    if (this.id || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.id)
    data['teams'] = this.teams
    return data
  }
}

interface ProjectTeams {
  project_location_id: number
  team_id: number
  employees: { emp_id: number; is_leader: boolean }[]
}
