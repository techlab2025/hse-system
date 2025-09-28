import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsFeatureDetailsModel from '../../Data/models/AboutUsFeatureDetailsModel'
import { ShowAboutUsFeatureApiService } from '../../Data/apiServices/showAboutUsFeatureApiService'


// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowAboutUsFeatureRepo extends RepoInterface<AboutUsFeatureDetailsModel> {
  private static instance: ShowAboutUsFeatureRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAboutUsFeatureRepo()
    }
    return this.instance
  }

  onParse(data: any): AboutUsFeatureDetailsModel {
    return AboutUsFeatureDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowAboutUsFeatureApiService.getInstance()
  }
}

export { ShowAboutUsFeatureRepo }
