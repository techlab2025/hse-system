import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemRiskManagementDetailsModel from '../../Data/models/SystemRiskManagementDetailsModel'
import { ShowSystemRiskManagementApiService } from '../../Data/apiServices/showSystemRiskManagementApiService'


// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowSystemRiskManagementRepo extends RepoInterface<SystemRiskManagementDetailsModel> {
  private static instance: ShowSystemRiskManagementRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemRiskManagementRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemRiskManagementDetailsModel {
    return SystemRiskManagementDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowSystemRiskManagementApiService.getInstance()
  }
}

export { ShowSystemRiskManagementRepo }
