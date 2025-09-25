import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceSectionDetailsModel from '../../Data/models/ServiceDetailsSectionModel'
import { ShowServiceSectionApiService } from '../../Data/apiServices/showServiceSectionApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowServiceSectionRepo extends RepoInterface<ServiceSectionDetailsModel> {
  private static instance: ShowServiceSectionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowServiceSectionRepo()
    }
    return this.instance
  }

  onParse(data: any): ServiceSectionDetailsModel {
    return ServiceSectionDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowServiceSectionApiService.getInstance()
  }
}

export { ShowServiceSectionRepo }
