// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectModel from '../../Data/models/ProjectModel'
import { DeleteProjectApiService } from '../../Data/apiServices/deleteProjectApiService'

// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteProjectRepo extends RepoInterface<ProjectModel> {
  private static instance: DeleteProjectRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteProjectRepo()
    }
    return this.instance
  }

  onParse(data: any): ProjectModel {
    return ProjectModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteProjectApiService.getInstance()
  }
}

export { DeleteProjectRepo }
