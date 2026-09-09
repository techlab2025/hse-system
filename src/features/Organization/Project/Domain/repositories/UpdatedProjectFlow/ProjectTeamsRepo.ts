import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectFlowResponseModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowResponseModel'
import { ProjectTeamsApiService } from '../../../Data/apiServices/UpdatedProjectFlow/ProjectTeamsApiService'

class ProjectTeamsRepo extends RepoInterface<ProjectFlowResponseModel> {
  private static instance: ProjectTeamsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ProjectTeamsRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown> | Array<Record<string, unknown>>): ProjectFlowResponseModel {
    const value = Array.isArray(data) ? data[0] : data
    return ProjectFlowResponseModel.fromMap(value as {
      project_status: ProjectFlowResponseModel['projectStatus']
      project_progress: number
      project_id?: number
      id?: number
      project?: { id?: number }
    })
  }

  get serviceInstance(): ServicesInterface {
    return ProjectTeamsApiService.getInstance()
  }
}

export { ProjectTeamsRepo }
