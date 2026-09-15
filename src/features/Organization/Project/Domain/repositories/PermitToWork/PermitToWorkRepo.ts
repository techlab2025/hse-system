// import LangModel from '@/features/setting/Project/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectModel from '../../../Data/models/ProjectModel'
import { PermitToWorkApiService } from '../../../Data/apiServices/PermitToWork/PermitToWorkApiService'

class PermitToWorkRepo extends RepoInterface<ProjectModel> {
  private static instance: PermitToWorkRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new PermitToWorkRepo()
    }
    return this.instance
  }

  // override get responseType(): ResponseType {
  //   return ResponseType.withoutData
  // }

  onParse(data: any): ProjectModel {
    return ProjectModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return PermitToWorkApiService.getInstance()
  }
}

export { PermitToWorkRepo }
