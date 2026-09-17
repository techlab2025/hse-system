// import LangModel from '@/features/setting/Project/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectModel from '../../../Data/models/ProjectModel'
import { PermitToWorkResultApiService } from '../../../Data/apiServices/PermitToWork/PermitToWorkResultApiService'

class PermitToWorkResultRepo extends RepoInterface<ProjectModel> {
  private static instance: PermitToWorkResultRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new PermitToWorkResultRepo()
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
    return PermitToWorkResultApiService.getInstance()
  }
}

export { PermitToWorkResultRepo }
