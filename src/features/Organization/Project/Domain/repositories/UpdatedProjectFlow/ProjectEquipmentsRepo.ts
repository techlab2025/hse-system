import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectFlowResponseModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowResponseModel'
import { ProjectEquipmentsApiService } from '../../../Data/apiServices/UpdatedProjectFlow/ProjectEquipmentsApiService'

class ProjectEquipmentsRepo extends RepoInterface<ProjectFlowResponseModel> {
  private static instance: ProjectEquipmentsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ProjectEquipmentsRepo()
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
    return ProjectEquipmentsApiService.getInstance()
  }
}

export { ProjectEquipmentsRepo }
