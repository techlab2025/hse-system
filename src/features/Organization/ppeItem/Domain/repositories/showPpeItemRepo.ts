import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowPpeItemApiService } from '../../Data/apiServices/showPpeItemApiService'
import PpeItemDetailsModel from '../../Data/models/PpeItemDetailsModel'

class ShowPpeItemRepo extends RepoInterface<PpeItemDetailsModel> {
  private static instance: ShowPpeItemRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPpeItemRepo()
    }
    return this.instance
  }

  onParse(data: any): PpeItemDetailsModel {
    return PpeItemDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowPpeItemApiService.getInstance()
  }
}

export { ShowPpeItemRepo }
