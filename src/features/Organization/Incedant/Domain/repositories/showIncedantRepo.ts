import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IncedantDetailsModel from '../../Data/models/IncedantDetailsModel'
import { ShowIncedantApiService } from '../../Data/apiServices/showIncedantApiService'

class ShowIncedantRepo extends RepoInterface<IncedantDetailsModel> {
  private static instance: ShowIncedantRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowIncedantRepo()
    }
    return this.instance
  }

  onParse(data: any): IncedantDetailsModel {
    return IncedantDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowIncedantApiService.getInstance()
  }
}

export { ShowIncedantRepo }
