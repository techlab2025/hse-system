import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceLogDetailsModel from '../../Data/models/ServiceDetailsLogModel'
import { ShowServiceLogApiService } from '../../Data/apiServices/showServiceLogApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowServiceLogRepo extends RepoInterface<ServiceLogDetailsModel> {
  private static instance: ShowServiceLogRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowServiceLogRepo()
    }
    return this.instance
  }

  onParse(data: any): ServiceLogDetailsModel {
    return ServiceLogDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowServiceLogApiService.getInstance()
  }
}

export { ShowServiceLogRepo }
