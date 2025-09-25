import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeAboutUsDetailsModel from '../../Data/models/HomeAboutUsDetailsModel'
import { ShowHomeAboutUsApiService } from '../../Data/apiServices/showHomeAboutUsApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowHomeAboutUsRepo extends RepoInterface<HomeAboutUsDetailsModel> {
  private static instance: ShowHomeAboutUsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHomeAboutUsRepo()
    }
    return this.instance
  }

  onParse(data: any): HomeAboutUsDetailsModel {
    return HomeAboutUsDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowHomeAboutUsApiService.getInstance()
  }
}

export { ShowHomeAboutUsRepo }
