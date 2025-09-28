import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemFeatureDetailsModel from '../../Data/models/SystemFeatureDetailsModel'
import { ShowSystemFeatureApiService } from '../../Data/apiServices/showSystemFeatureApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowSystemFeatureRepo extends RepoInterface<SystemFeatureDetailsModel> {
  private static instance: ShowSystemFeatureRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemFeatureRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemFeatureDetailsModel {
    return SystemFeatureDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowSystemFeatureApiService.getInstance()
  }
}

export { ShowSystemFeatureRepo }
