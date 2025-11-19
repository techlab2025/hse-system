import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditHazardApiService } from '../../Data/apiServices/editHazardApiService'
import HazardModel from '../../Data/models/hazardModel'

class EditHazardRepo extends RepoInterface<HazardModel> {
  private static instance: EditHazardRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHazardRepo()
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
    return EditHazardApiService.getInstance()
  }
}

export { EditHazardRepo }
