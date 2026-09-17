import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectFlowResponseModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowResponseModel'
import ProjectFlowDetailsModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowDetailsModel'
import {
  BasicProjectApiService,
  ProjectEquipmentsApiService,
  ProjectHolidaysApiService,
  ProjectLocationPositionEmployeesApiService,
  ProjectTeamsApiService,
  ProjectFlowDetailsApiService,
} from '../../../Data/apiServices/UpdatedProjectFlow/ProjectFlowApiServices'

abstract class ProjectFlowRepo extends RepoInterface<ProjectFlowResponseModel> {
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
}

export class BasicProjectRepo extends ProjectFlowRepo {
  get serviceInstance(): ServicesInterface { return new BasicProjectApiService() }
}

export class ProjectHolidaysRepo extends ProjectFlowRepo {
  get serviceInstance(): ServicesInterface { return new ProjectHolidaysApiService() }
}

export class ProjectLocationPositionEmployeesRepo extends ProjectFlowRepo {
  get serviceInstance(): ServicesInterface { return new ProjectLocationPositionEmployeesApiService() }
}

export class ProjectTeamsRepo extends ProjectFlowRepo {
  get serviceInstance(): ServicesInterface { return new ProjectTeamsApiService() }
}

export class ProjectEquipmentsRepo extends ProjectFlowRepo {
  get serviceInstance(): ServicesInterface { return new ProjectEquipmentsApiService() }
}

export class ProjectFlowDetailsRepo extends RepoInterface<ProjectFlowDetailsModel> {
  onParse(data: Record<string, unknown> | Array<Record<string, unknown>>): ProjectFlowDetailsModel {
    return ProjectFlowDetailsModel.fromMap(Array.isArray(data) ? data[0] : data)
  }
  get serviceInstance(): ServicesInterface { return new ProjectFlowDetailsApiService() }
}
