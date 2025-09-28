import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsCoreDetailsModel from '../../Data/models/AboutUsCoreDetailsModel'
import { ShowAboutUsCoreApiService } from '../../Data/apiServices/showAboutUsCoreApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowAboutUsCoreRepo extends RepoInterface<AboutUsCoreDetailsModel> {
  private static instance: ShowAboutUsCoreRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAboutUsCoreRepo()
    }
    return this.instance
  }

  onParse(data: any): AboutUsCoreDetailsModel {
    return AboutUsCoreDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowAboutUsCoreApiService.getInstance()
  }
}

export { ShowAboutUsCoreRepo }
