import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HazardModel from '../../Data/models/hazardModel'
import { DeleteHazardApiService } from '../../Data/apiServices/deleteHazardApiService'

class DeleteHazardRepo extends RepoInterface<HazardModel> {
  private static instance: DeleteHazardRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHazardRepo()
    }
    return this.instance
  }

  onParse(data: any): HazardModel {
    return HazardModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteHazardApiService.getInstance()
  }
}

export { DeleteHazardRepo }
