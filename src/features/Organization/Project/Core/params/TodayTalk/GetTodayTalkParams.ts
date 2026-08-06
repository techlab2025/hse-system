import type Params from '@/base/core/params/params'

export default class GetTodayTalkParams implements Params {
  constructor(
    public readonly projectId?: number,
    public readonly isAssignedToProject?: boolean,
  ) {}

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    if (this.projectId != null) data.project_id = this.projectId
    if (this.isAssignedToProject != null) {
      data.is_assigned_to_project = Number(this.isAssignedToProject)
    }
    return data
  }
}
