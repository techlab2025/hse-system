// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceModel from '../../Data/models/ServiceFeatureModel'
import { DeleteServiceApiService } from '../../Data/apiServices/deleteServiceFeatureApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteServiceRepo extends RepoInterface<ServiceModel> {
  private static instance: DeleteServiceRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteServiceRepo()
    }
    return this.instance
  }

  onParse(data: any): ServiceModel {
    return ServiceModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteServiceApiService.getInstance()
  }
}

export { DeleteServiceRepo }
