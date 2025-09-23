import { AddProjectTypeApiService } from '@/features/setting/ProjectType/Data/apiServices/addProjectTypeApiService'
// import LangModel from '@/features/setting/ProjectType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeModel'

class AddProjectTypeRepo extends RepoInterface<ProjectTypeModel> {
  private static instance: AddProjectTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddProjectTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ProjectTypeModel {
    return ProjectTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddProjectTypeApiService.getInstance()
  }
}

export { AddProjectTypeRepo }
