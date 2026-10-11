import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowPPEToolApiService } from '../../Data/apiServices/showPPEToolApiService'
import PPEToolDetailsModel from '../../Data/models/PPEToolDetailsModel'

class ShowPPEToolRepo extends RepoInterface<PPEToolDetailsModel> {
  private static instance: ShowPPEToolRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPPEToolRepo()
    }
    return this.instance
  }

  onParse(data: any): PPEToolDetailsModel {
    return PPEToolDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowPPEToolApiService.getInstance()
  }
}

export { ShowPPEToolRepo }
