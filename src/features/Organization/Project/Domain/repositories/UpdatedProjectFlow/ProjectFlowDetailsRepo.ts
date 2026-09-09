import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectFlowDetailsModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowDetailsModel'
import { ProjectFlowDetailsApiService } from '../../../Data/apiServices/UpdatedProjectFlow/ProjectFlowDetailsApiService'

class ProjectFlowDetailsRepo extends RepoInterface<ProjectFlowDetailsModel> {
  private static instance: ProjectFlowDetailsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ProjectFlowDetailsRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown> | Array<Record<string, unknown>>): ProjectFlowDetailsModel {
    return ProjectFlowDetailsModel.fromMap(Array.isArray(data) ? data[0] : data)
  }

  get serviceInstance(): ServicesInterface {
    return ProjectFlowDetailsApiService.getInstance()
  }
}

export { ProjectFlowDetailsRepo }
