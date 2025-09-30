import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectZoneDetailsModel from '../../Data/models/ProjectZoneDetailsModel'
import { ShowProjectZoneApiService } from '../../Data/apiServices/showProjectZoneApiService'


// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowProjectZoneRepo extends RepoInterface<ProjectZoneDetailsModel> {
  private static instance: ShowProjectZoneRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectZoneRepo()
    }
    return this.instance
  }

  onParse(data: any): ProjectZoneDetailsModel {
    return ProjectZoneDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowProjectZoneApiService.getInstance()
  }
}

export { ShowProjectZoneRepo }
