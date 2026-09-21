import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowPPEActivityApiService } from '../../Data/apiServices/showPPEActivityApiService'
import PPEActivityDetailsModel from '../../Data/models/PPEActivityDetailsModel'

class ShowPPEActivityRepo extends RepoInterface<PPEActivityDetailsModel> {
  private static instance: ShowPPEActivityRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPPEActivityRepo()
    }
    return this.instance
  }

  onParse(data: any): PPEActivityDetailsModel {
    return PPEActivityDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowPPEActivityApiService.getInstance()
  }
}

export { ShowPPEActivityRepo }
