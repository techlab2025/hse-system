import { ProjectProgressStatusEnum } from '../../../Core/Enums/UpdatedProjectFlow/ProjectProgressStatusEnum'

export default class ProjectFlowResponseModel {
  constructor(
    public readonly projectStatus: ProjectProgressStatusEnum,
    public readonly projectProgress: number,
    public readonly id?: number,
  ) {}

  static fromMap(data: {
    project_status: ProjectProgressStatusEnum
    project_progress: number
    project_id?: number
    id?: number
    project?: { id?: number }
  }): ProjectFlowResponseModel {
    return new ProjectFlowResponseModel(
      data.project_status,
      data.project_progress,
      data.project_id ?? data.id ?? data.project?.id,
    )
  }
}
