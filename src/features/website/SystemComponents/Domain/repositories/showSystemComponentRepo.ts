import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemComponentDetailsModel from '../../Data/models/SystemComponentDetailsModel'
import { ShowSystemComponentApiService } from '../../Data/apiServices/showSystemComponentApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowSystemComponentRepo extends RepoInterface<SystemComponentDetailsModel> {
  private static instance: ShowSystemComponentRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemComponentRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemComponentDetailsModel {
    return SystemComponentDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowSystemComponentApiService.getInstance()
  }
}

export { ShowSystemComponentRepo }
