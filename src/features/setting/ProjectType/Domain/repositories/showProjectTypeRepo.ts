import { ShowProjectTypeApiService } from '@/features/setting/ProjectType/Data/apiServices/showProjectTypeApiService'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import ProjectTypeDetailsModel from '@/features/setting/ProjectType/Data/models/projectTypeDetailsModel'

class ShowProjectTypeRepo extends RepoInterface<ProjectTypeDetailsModel> {
  private static instance: ShowProjectTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): ProjectTypeDetailsModel {
    return ProjectTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowProjectTypeApiService.getInstance()
  }
}

export { ShowProjectTypeRepo }
