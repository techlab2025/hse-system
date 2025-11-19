import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InspectionModel from '../../Data/models/InspectionModel'
import { DisInspectionApiService } from '../../Data/apiServices/disInspectionApiService'

class DisActiveInspectionRepo extends RepoInterface<InspectionModel> {
  private static instance: DisActiveInspectionRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveInspectionRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): InspectionModel {
    return InspectionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisInspectionApiService.getInstance()
  }
}

export { DisActiveInspectionRepo }
