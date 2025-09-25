import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeContactUsDetailsModel from '../../Data/models/HomeContactUsDetailsModel'
import { ShowHomeContactUsApiService } from '../../Data/apiServices/showHomeContactUsApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowHomeContactUsRepo extends RepoInterface<HomeContactUsDetailsModel> {
  private static instance: ShowHomeContactUsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHomeContactUsRepo()
    }
    return this.instance
  }

  onParse(data: any): HomeContactUsDetailsModel {
    return HomeContactUsDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowHomeContactUsApiService.getInstance()
  }
}

export { ShowHomeContactUsRepo }
