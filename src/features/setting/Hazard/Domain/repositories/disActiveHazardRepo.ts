import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HazardModel from '../../Data/models/hazardModel'
import { DisHazardApiService } from '../../Data/apiServices/disHazardApiService'

class DisActiveHazardRepo extends RepoInterface<HazardModel> {
  private static instance: DisActiveHazardRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveHazardRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): HazardModel {
    return HazardModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisHazardApiService.getInstance()
  }
}

export { DisActiveHazardRepo }
