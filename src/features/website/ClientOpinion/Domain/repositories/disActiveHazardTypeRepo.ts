import { DisHazardTypeApiService } from '@/features/setting/HazardType/Data/apiServices/disHazardTypeApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'

class DisActiveHazardTypeRepo extends RepoInterface<HazardTypeModel> {
  private static instance: DisActiveHazardTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveHazardTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): HazardTypeModel {
    return HazardTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisHazardTypeApiService.getInstance()
  }
}

export { DisActiveHazardTypeRepo }
