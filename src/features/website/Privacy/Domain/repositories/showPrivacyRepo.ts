import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PrivacyDetailsModel from '../../Data/models/PrivacyDetailsModel'
import { ShowPrivacyApiService } from '../../Data/apiServices/showPrivacyApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowPrivacyRepo extends RepoInterface<PrivacyDetailsModel> {
  private static instance: ShowPrivacyRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPrivacyRepo()
    }
    return this.instance
  }

  onParse(data: any): PrivacyDetailsModel {
    return PrivacyDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowPrivacyApiService.getInstance()
  }
}

export { ShowPrivacyRepo }
