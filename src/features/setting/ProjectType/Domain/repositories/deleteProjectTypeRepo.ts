import { DeleteProjectTypeApiService } from '@/features/setting/ProjectType/Data/apiServices/deleteProjectTypeApiService'
// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import ProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeModel'

class DeleteProjectTypeRepo extends RepoInterface<ProjectTypeModel> {
  private static instance: DeleteProjectTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteProjectTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): ProjectTypeModel {
    return ProjectTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteProjectTypeApiService.getInstance()
  }
}

export { DeleteProjectTypeRepo }
