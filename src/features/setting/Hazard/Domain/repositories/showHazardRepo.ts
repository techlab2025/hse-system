import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HazardDetailsModel from '../../Data/models/hazardDetailsModel'
import { ShowHazardApiService } from '../../Data/apiServices/showHazardApiService'

class ShowHazardRepo extends RepoInterface<HazardDetailsModel> {
  private static instance: ShowHazardRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHazardRepo()
    }
    return this.instance
  }

  onParse(data: any): HazardDetailsModel {
    return HazardDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowHazardApiService.getInstance()
  }
}

export { ShowHazardRepo }
