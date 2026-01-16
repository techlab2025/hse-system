import { DeleteHazardTypeApiService } from '@/features/setting/HazardType/Data/apiServices/deleteHazardTypeApiService'
// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'

class DeleteHazardTypeRepo extends RepoInterface<HazardTypeModel> {
  private static instance: DeleteHazardTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHazardTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): HazardTypeModel {
    return HazardTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteHazardTypeApiService.getInstance()
  }
}

export { DeleteHazardTypeRepo }
