import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceFeatureDetailsModel from '../../Data/models/ServiceFeatureDetailsModel'
import { ShowServiceFeatureApiService } from '../../Data/apiServices/showServiceFeatureApiService'


// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowServiceFeatureRepo extends RepoInterface<ServiceFeatureDetailsModel> {
  private static instance: ShowServiceFeatureRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowServiceFeatureRepo()
    }
    return this.instance
  }

  onParse(data: any): ServiceFeatureDetailsModel {
    return ServiceFeatureDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowServiceFeatureApiService.getInstance()
  }
}

export { ShowServiceFeatureRepo }
