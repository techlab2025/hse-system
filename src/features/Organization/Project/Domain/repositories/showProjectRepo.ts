import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectDetailsModel from '../../Data/models/ProjectDetailsModel'
import { ShowProjectApiService } from '../../Data/apiServices/showProjectApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowProjectRepo extends RepoInterface<ProjectDetailsModel> {
  private static instance: ShowProjectRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectRepo()
    }
    return this.instance
  }

  onParse(data: any): ProjectDetailsModel {
    return ProjectDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowProjectApiService.getInstance()
  }
}

export { ShowProjectRepo }
