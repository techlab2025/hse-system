import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PartnerDetailsModel from '../../Data/models/PartnerDetailsModel'
import { ShowPartnerApiService } from '../../Data/apiServices/showPartnerApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowPartnerRepo extends RepoInterface<PartnerDetailsModel> {
  private static instance: ShowPartnerRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPartnerRepo()
    }
    return this.instance
  }

  onParse(data: any): PartnerDetailsModel {
    return PartnerDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowPartnerApiService.getInstance()
  }
}

export { ShowPartnerRepo }
