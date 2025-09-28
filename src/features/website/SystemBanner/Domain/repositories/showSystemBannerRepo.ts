import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemBannerDetailsModel from '../../Data/models/SystemBannerDetailsModel'
import { ShowSystemBannerApiService } from '../../Data/apiServices/showSystemBannerApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowSystemBannerRepo extends RepoInterface<SystemBannerDetailsModel> {
  private static instance: ShowSystemBannerRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemBannerRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemBannerDetailsModel {
    return SystemBannerDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowSystemBannerApiService.getInstance()
  }
}

export { ShowSystemBannerRepo }
