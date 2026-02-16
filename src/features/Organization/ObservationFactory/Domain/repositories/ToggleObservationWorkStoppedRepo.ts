import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HazardModel from '../../Data/models/hazardModel'
import { ToggleObservationWorkStoppedApiService } from '../../Data/apiServices/ToggleObservationWorkStoppedApiService'

class ToggleObservationWorkStoppedRepo extends RepoInterface<HazardModel> {
  private static instance: ToggleObservationWorkStoppedRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ToggleObservationWorkStoppedRepo()
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
    return ToggleObservationWorkStoppedApiService.getInstance()
  }
}

export { ToggleObservationWorkStoppedRepo }
