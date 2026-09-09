import type Params from '@/base/core/params/params'
import type { ProjectLocationTeam } from './ProjectLocationTeamParams'

export default class ProjectTeamsParams implements Params {
  public readonly locations: ProjectLocationTeam[]
  public readonly projectId: number
  public readonly isUpdate: boolean

  constructor(data: { locations: ProjectLocationTeam[]; projectId: number; isUpdate: boolean }) {
    this.locations = data.locations
    this.projectId = data.projectId
    this.isUpdate = data.isUpdate
  }

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      ...(this.locations.length > 0 && {
        locations: this.locations,
      }),
    }
  }
}
