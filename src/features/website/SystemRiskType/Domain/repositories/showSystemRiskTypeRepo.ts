import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemRiskTypeDetailsModel from '../../Data/models/SystemRiskTypeDetailsModel'
import { ShowSystemRiskTypeApiService } from '../../Data/apiServices/showSystemRiskTypeApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowSystemRiskTypeRepo extends RepoInterface<SystemRiskTypeDetailsModel> {
  private static instance: ShowSystemRiskTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemRiskTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemRiskTypeDetailsModel {
    return SystemRiskTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowSystemRiskTypeApiService.getInstance()
  }
}

export { ShowSystemRiskTypeRepo }
