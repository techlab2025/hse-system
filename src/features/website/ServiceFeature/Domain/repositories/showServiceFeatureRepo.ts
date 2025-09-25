import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceDetailsModel from '../../Data/models/ServiceDetailsFeatureModel'
import { ShowServiceApiService } from '../../Data/apiServices/showServiceFeatureApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowServiceRepo extends RepoInterface<ServiceDetailsModel> {
  private static instance: ShowServiceRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowServiceRepo()
    }
    return this.instance
  }

  onParse(data: any): ServiceDetailsModel {
    return ServiceDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowServiceApiService.getInstance()
  }
}

export { ShowServiceRepo }
